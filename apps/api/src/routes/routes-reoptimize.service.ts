import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DeliveryStatus,
  RouteStatus,
  RouteStopStatus,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { EventsService } from '../events/events.service';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoutingService } from '../routing/routing.service';
import { OptimizerClientService } from '../optimization/optimizer-client.service';
import {
  HORIZON_SEC,
  SERVICE_TIME_SEC,
  computeLegMetrics,
  extractDeliveryVisitOrder,
  parseRouteStart,
  secondsFromRouteStart,
  volumeToUnits,
  weightToUnits,
  dropPenaltyForPriority,
  type MatrixPoint,
} from '../optimization/optimization-vrp.util';
import { RoutesService, type RouteResponse } from './routes.service';

@Injectable()
export class RoutesReoptimizeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
    private readonly routing: RoutingService,
    private readonly optimizer: OptimizerClientService,
    private readonly routes: RoutesService,
    private readonly events: EventsService,
  ) {}

  async reoptimize(
    user: JwtPayload,
    routeId: string,
    includeDeliveryIds: string[] = [],
  ): Promise<RouteResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);

    const route = await this.prisma.route.findFirst({
      where: this.orgScope.forOrganization(user, { id: routeId }),
      include: {
        vehicle: true,
        stops: {
          orderBy: { stopOrder: 'asc' },
          include: { delivery: true },
        },
      },
    });

    if (!route) {
      throw new NotFoundException('Rute ikke funnet');
    }
    if (route.status !== RouteStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Re-optimalisering krever at ruten er IN_PROGRESS',
      );
    }
    if (!route.vehicle) {
      throw new BadRequestException('Ruten må ha tilknyttet kjøretøy');
    }

    const lockedStops = route.stops.filter(
      (s) =>
        s.status === RouteStopStatus.COMPLETED ||
        s.status === RouteStopStatus.FAILED,
    );
    const pendingStops = route.stops.filter(
      (s) => s.status === RouteStopStatus.PENDING,
    );

    let extraDeliveries: Awaited<
      ReturnType<typeof this.prisma.delivery.findMany>
    > = [];
    if (includeDeliveryIds.length > 0) {
      extraDeliveries = await this.prisma.delivery.findMany({
        where: {
          organizationId,
          id: { in: includeDeliveryIds },
          status: DeliveryStatus.PENDING,
        },
      });
    }

    const pendingDeliveries = [
      ...pendingStops.map((s) => s.delivery),
      ...extraDeliveries,
    ];

    if (pendingDeliveries.length === 0) {
      throw new BadRequestException('Ingen gjenværende stopp å optimalisere');
    }

    const vehicle = route.vehicle;
    const returnToDepot = true;
    const points: MatrixPoint[] = [];
    const depotStart: MatrixPoint = {
      id: 'depot-start',
      kind: 'depot-start',
      latitude: decimalToNumber(vehicle.startLatitude)!,
      longitude: decimalToNumber(vehicle.startLongitude)!,
      vehicleIndex: 0,
    };
    points.push(depotStart);

    pendingDeliveries.forEach((d, i) => {
      points.push({
        id: d.id,
        kind: 'delivery',
        latitude: decimalToNumber(d.latitude)!,
        longitude: decimalToNumber(d.longitude)!,
        deliveryIndex: i,
      });
    });

    const depotEnd: MatrixPoint = {
      id: 'depot-end',
      kind: 'depot-end',
      latitude: decimalToNumber(
        returnToDepot ? vehicle.endLatitude : vehicle.startLatitude,
      )!,
      longitude: decimalToNumber(
        returnToDepot ? vehicle.endLongitude : vehicle.startLongitude,
      )!,
      vehicleIndex: 0,
    };
    points.push(depotEnd);

    const matrix = await this.routing.buildDistanceTimeMatrix(points);

    const routeStart = parseRouteStart(
      route.plannedDate.toISOString().slice(0, 10),
      '08:00',
    );

    const vrpDeliveries = pendingDeliveries.map((d, i) => ({
      node_index: i + 1,
      delivery_index: i,
      weight_units: weightToUnits(Number(d.weightKg)),
      volume_units: volumeToUnits(
        d.volumeM3 != null ? Number(d.volumeM3) : null,
      ),
      package_count: 1,
      time_window_start_sec: secondsFromRouteStart(
        routeStart,
        d.timeWindowStart,
      ),
      time_window_end_sec: secondsFromRouteStart(routeStart, d.timeWindowEnd),
      deadline_sec: secondsFromRouteStart(routeStart, d.deadline),
      priority: d.priority,
      drop_penalty: dropPenaltyForPriority(d.priority),
    }));

    const vrpResult = await this.optimizer.solveVrp({
      duration_matrix: matrix.durationsSeconds,
      distance_matrix: matrix.distancesMeters,
      vehicles: [
        {
          start_index: 0,
          end_index: points.length - 1,
          max_weight_units: 1_000_000_000,
          max_volume_units: 1_000_000_000,
          max_packages: 10_000,
        },
      ],
      deliveries: vrpDeliveries,
      objective: 'MINIMIZE_TOTAL_TIME',
      respect_capacity: false,
      respect_time_windows: true,
      service_time_sec: SERVICE_TIME_SEC,
      horizon_sec: HORIZON_SEC,
    });

    const vrpRoute = vrpResult.routes[0];
    if (!vrpRoute) {
      throw new BadRequestException('Optimalisering ga ingen rute');
    }

    const visitIndices = extractDeliveryVisitOrder(
      vrpRoute.routeIndices,
      points,
    );

    const { stopEtas } = computeLegMetrics(
      vrpRoute.routeIndices,
      matrix,
      routeStart,
    );

    const maxLockedOrder =
      lockedStops.length > 0
        ? Math.max(...lockedStops.map((s) => s.stopOrder))
        : 0;

    await this.prisma.$transaction(async (tx) => {
      for (const extra of extraDeliveries) {
        const exists = await tx.routeStop.findFirst({
          where: { routeId, deliveryId: extra.id },
        });
        if (!exists) {
          await tx.routeStop.create({
            data: {
              routeId,
              deliveryId: extra.id,
              stopOrder: 9999,
              status: RouteStopStatus.PENDING,
            },
          });
          await tx.delivery.update({
            where: { id: extra.id },
            data: { status: DeliveryStatus.ASSIGNED },
          });
        }
      }

      const pendingStopByDelivery = new Map(
        (
          await tx.routeStop.findMany({
            where: {
              routeId,
              status: RouteStopStatus.PENDING,
            },
          })
        ).map((s) => [s.deliveryId, s]),
      );

      let order = maxLockedOrder;
      for (let i = 0; i < visitIndices.length; i++) {
        const point = points[visitIndices[i]];
        if (point.kind !== 'delivery') continue;
        order += 1;
        const stop = pendingStopByDelivery.get(point.id);
        if (!stop) continue;

        await tx.routeStop.update({
          where: { id: stop.id },
          data: {
            stopOrder: order,
            estimatedArrival: stopEtas[i] ?? null,
          },
        });
      }

      const metrics = computeLegMetrics(
        vrpRoute.routeIndices,
        matrix,
        routeStart,
      );

      await tx.route.update({
        where: { id: routeId },
        data: {
          totalDistanceMeters: metrics.totalDistanceMeters,
          totalDurationSeconds: metrics.totalDurationSeconds,
        },
      });
    });

    this.events.publish(organizationId, 'route.updated', {
      routeId,
      action: 'reoptimized',
    });

    return this.routes.findOne(user, routeId);
  }
}
