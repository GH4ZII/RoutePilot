import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  DeliveryPriority,
  DeliveryStatus,
  DriverStatus,
  OptimizationJobStatus,
  OptimizationObjective,
  RouteStatus,
  RouteStopStatus,
  VehicleStatus,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoutingService } from '../routing/routing.service';
import { CreateOptimizationJobDto } from './dto/create-optimization-job.dto';
import {
  OptimizerClientService,
  type VrpDeliveryPayload,
} from './optimizer-client.service';
import {
  HORIZON_SEC,
  SERVICE_TIME_SEC,
  computeLegMetrics,
  dropPenaltyForPriority,
  extractDeliveryVisitOrder,
  parseRouteStart,
  secondsFromRouteStart,
  volumeToUnits,
  weightToUnits,
  type MatrixPoint,
} from './optimization-vrp.util';

export const OPTIMIZATION_QUEUE = 'optimization';

export type OptimizationJobRequest = {
  plannedDate: string;
  vehicleIds: string[];
  driverIds?: string[];
  deliveryIds: string[];
  objective: OptimizationObjective;
  routeStartTime: string;
  returnToDepot: boolean;
  respectCapacity: boolean;
  respectTimeWindows: boolean;
};

export type OptimizationJobResponse = {
  id: string;
  organizationId: string;
  status: OptimizationJobStatus;
  objective: OptimizationObjective;
  plannedDate: string;
  request: OptimizationJobRequest;
  result: unknown;
  errorMessage: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};


@Injectable()
export class OptimizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
    private readonly routing: RoutingService,
    private readonly optimizer: OptimizerClientService,
    @InjectQueue(OPTIMIZATION_QUEUE) private readonly queue: Queue,
  ) {}

  async createJob(
    user: JwtPayload,
    dto: CreateOptimizationJobDto,
  ): Promise<OptimizationJobResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);
    const request = await this.validateCreateRequest(organizationId, dto);

    const job = await this.prisma.optimizationJob.create({
      data: {
        organizationId,
        status: OptimizationJobStatus.PENDING,
        objective: request.objective,
        plannedDate: new Date(`${request.plannedDate}T12:00:00.000Z`),
        request: request as object,
      },
    });

    await this.queue.add(
      'run',
      { jobId: job.id, organizationId },
      { jobId: job.id, removeOnComplete: 100, removeOnFail: 50 },
    );

    return this.toJobResponse(job);
  }

  async findJob(
    user: JwtPayload,
    id: string,
  ): Promise<OptimizationJobResponse> {
    const job = await this.prisma.optimizationJob.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
    });
    if (!job) {
      throw new NotFoundException('Optimaliseringsjobb ikke funnet');
    }
    return this.toJobResponse(job);
  }

  /** Called by BullMQ worker. */
  async runJob(jobId: string, organizationId: string): Promise<void> {
    const job = await this.prisma.optimizationJob.findFirst({
      where: { id: jobId, organizationId },
    });
    if (!job) {
      return;
    }
    if (
      job.status === OptimizationJobStatus.COMPLETED ||
      job.status === OptimizationJobStatus.FAILED
    ) {
      return;
    }

    await this.prisma.optimizationJob.update({
      where: { id: jobId },
      data: {
        status: OptimizationJobStatus.RUNNING,
        startedAt: new Date(),
        errorMessage: null,
      },
    });

    try {
      const request = job.request as OptimizationJobRequest;
      const result = await this.executeVrpOptimization(organizationId, request);

      await this.prisma.optimizationJob.update({
        where: { id: jobId },
        data: {
          status: OptimizationJobStatus.COMPLETED,
          result: result as object,
          completedAt: new Date(),
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Optimalisering feilet';
      await this.prisma.optimizationJob.update({
        where: { id: jobId },
        data: {
          status: OptimizationJobStatus.FAILED,
          errorMessage: message,
          completedAt: new Date(),
        },
      });
    }
  }

  private async executeVrpOptimization(
    organizationId: string,
    request: OptimizationJobRequest,
  ) {
    const vehicles = await this.loadAvailableVehicles(
      organizationId,
      request.vehicleIds,
    );
    const drivers = await this.resolveDrivers(
      organizationId,
      request.vehicleIds,
      request.driverIds,
    );
    const deliveries = await this.loadPendingDeliveries(
      organizationId,
      request.deliveryIds,
    );

    const routeStart = parseRouteStart(
      request.plannedDate,
      request.routeStartTime,
    );
    const returnToDepot = request.returnToDepot !== false;

    const { points, vehicleDepots } = this.buildMatrixPoints(
      vehicles,
      deliveries,
      returnToDepot,
    );

    const matrix = await this.routing.buildDistanceTimeMatrix(points);

    const vrpDeliveries: VrpDeliveryPayload[] = deliveries.map((d, i) => ({
      node_index: i,
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

    const vrpVehicles = vehicleDepots.map((depot, vehicleIndex) => {
      const v = vehicles[vehicleIndex];
      const maxWeight = request.respectCapacity
        ? weightToUnits(decimalToNumber(v.maxWeightKg) ?? 0)
        : 1_000_000_000;
      const maxVolume = request.respectCapacity
        ? volumeToUnits(decimalToNumber(v.maxVolumeM3))
        : 1_000_000_000;
      const maxPackages = request.respectCapacity ? 10_000 : 10_000;

      return {
        start_index: depot.startIndex,
        end_index: depot.endIndex,
        max_weight_units: maxWeight,
        max_volume_units: maxVolume,
        max_packages: maxPackages,
      };
    });

    const vrpResult = await this.optimizer.solveVrp({
      duration_matrix: matrix.durationsSeconds,
      distance_matrix: matrix.distancesMeters,
      vehicles: vrpVehicles,
      deliveries: vrpDeliveries,
      objective: request.objective,
      respect_capacity: request.respectCapacity,
      respect_time_windows: request.respectTimeWindows,
      service_time_sec: SERVICE_TIME_SEC,
      horizon_sec: HORIZON_SEC,
    });

    const warnings: string[] = [];
    const unassignedDeliveryIds = vrpResult.unassignedDeliveryIndices.map(
      (idx) => deliveries[idx].id,
    );

    if (unassignedDeliveryIds.length > 0) {
      warnings.push(
        `${unassignedDeliveryIds.length} levering(er) kunne ikke tildeles (kapasitet, tidsvindu eller manglende sjåfør/kjøretøy).`,
      );
    }

    const routeResults: Array<{
      routeId: string;
      driverId: string | null;
      vehicleId: string;
      totalDistanceMeters: number;
      totalDurationSeconds: number;
      optimizerCost: number;
      capacityUsedKg: number;
      stops: Array<{
        deliveryId: string;
        order: number;
        estimatedArrival: string | null;
      }>;
    }> = [];

    await this.prisma.$transaction(async (tx) => {
      for (const vrpRoute of vrpResult.routes) {
        const vehicleIndex = vrpRoute.vehicleIndex;
        const vehicle = vehicles[vehicleIndex];
        const driverId = drivers[vehicleIndex] ?? null;

        const visitIndices = extractDeliveryVisitOrder(
          vrpRoute.routeIndices,
          points,
        );

        if (visitIndices.length === 0) {
          continue;
        }

        const { totalDistanceMeters, totalDurationSeconds, stopEtas } =
          computeLegMetrics(vrpRoute.routeIndices, matrix, routeStart);

        const assignedDeliveries = visitIndices
          .map((idx) => points[idx])
          .filter((p) => p.kind === 'delivery' && p.deliveryIndex != null);

        const capacityUsedKg = assignedDeliveries.reduce((sum, p) => {
          const d = deliveries[p.deliveryIndex!];
          return sum + Number(d.weightKg);
        }, 0);

        const createdRoute = await tx.route.create({
          data: {
            organizationId,
            vehicleId: vehicle.id,
            driverId,
            status: RouteStatus.PLANNED,
            plannedDate: new Date(`${request.plannedDate}T12:00:00.000Z`),
            totalDistanceMeters,
            totalDurationSeconds,
            capacityUsedKg,
          },
        });

        let stopOrder = 1;
        const stops: Array<{
          deliveryId: string;
          order: number;
          estimatedArrival: string | null;
        }> = [];

        for (const pointIndex of visitIndices) {
          const point = points[pointIndex];
          if (point.kind !== 'delivery' || point.deliveryIndex == null) {
            continue;
          }
          const delivery = deliveries[point.deliveryIndex];
          const eta = stopEtas.get(pointIndex) ?? null;

          await tx.routeStop.create({
            data: {
              routeId: createdRoute.id,
              deliveryId: delivery.id,
              stopOrder,
              estimatedArrival: eta,
              status: RouteStopStatus.PENDING,
            },
          });
          await tx.delivery.update({
            where: { id: delivery.id },
            data: { status: DeliveryStatus.ASSIGNED },
          });

          this.collectTimingWarnings(
            delivery,
            eta,
            routeStart,
            warnings,
          );

          stops.push({
            deliveryId: delivery.id,
            order: stopOrder,
            estimatedArrival: eta?.toISOString() ?? null,
          });
          stopOrder += 1;
        }

        routeResults.push({
          routeId: createdRoute.id,
          driverId,
          vehicleId: vehicle.id,
          totalDistanceMeters,
          totalDurationSeconds,
          optimizerCost: vrpRoute.totalCost,
          capacityUsedKg,
          stops,
        });
      }
    });

    if (routeResults.length === 0 && deliveries.length > 0) {
      throw new BadRequestException(
        'Optimalisering opprettet ingen ruter — sjekk kapasitet, tidsvinduer og tilgjengelige kjøretøy',
      );
    }

    return {
      routes: routeResults,
      unassignedDeliveries: unassignedDeliveryIds,
      warnings,
    };
  }

  private collectTimingWarnings(
    delivery: {
      id: string;
      deadline: Date | null;
      timeWindowStart: Date | null;
      timeWindowEnd: Date | null;
    },
    eta: Date | null,
    routeStart: Date,
    warnings: string[],
  ) {
    if (!eta) {
      return;
    }
    if (delivery.deadline && eta > delivery.deadline) {
      warnings.push(
        `Levering ${delivery.id}: estimert ankomst etter deadline.`,
      );
    }
    if (
      delivery.timeWindowEnd &&
      eta > delivery.timeWindowEnd
    ) {
      warnings.push(
        `Levering ${delivery.id}: estimert ankomst utenfor tidsvindu.`,
      );
    }
    if (
      delivery.timeWindowStart &&
      eta < delivery.timeWindowStart &&
      secondsFromRouteStart(routeStart, delivery.timeWindowStart) != null
    ) {
      warnings.push(
        `Levering ${delivery.id}: estimert ankomst før tidsvindu åpner.`,
      );
    }
  }

  private buildMatrixPoints(
    vehicles: Awaited<
      ReturnType<OptimizationService['loadAvailableVehicles']>
    >,
    deliveries: Awaited<
      ReturnType<OptimizationService['loadPendingDeliveries']>
    >,
    returnToDepot: boolean,
  ): {
    points: MatrixPoint[];
    vehicleDepots: Array<{ startIndex: number; endIndex: number }>;
  } {
    const points: MatrixPoint[] = deliveries.map((d, i) => ({
      id: d.id,
      kind: 'delivery' as const,
      deliveryIndex: i,
      latitude: decimalToNumber(d.latitude)!,
      longitude: decimalToNumber(d.longitude)!,
    }));

    const vehicleDepots: Array<{ startIndex: number; endIndex: number }> = [];

    for (let v = 0; v < vehicles.length; v += 1) {
      const vehicle = vehicles[v];
      const startLat = decimalToNumber(vehicle.startLatitude)!;
      const startLon = decimalToNumber(vehicle.startLongitude)!;
      const endLat = decimalToNumber(vehicle.endLatitude)!;
      const endLon = decimalToNumber(vehicle.endLongitude)!;

      const startIndex = points.length;
      points.push({
        id: `depot-start-${vehicle.id}`,
        kind: 'depot-start',
        vehicleIndex: v,
        latitude: startLat,
        longitude: startLon,
      });

      let endIndex = startIndex;
      const endDiffers =
        Math.abs(startLat - endLat) > 1e-6 ||
        Math.abs(startLon - endLon) > 1e-6;

      if (returnToDepot && endDiffers) {
        endIndex = points.length;
        points.push({
          id: `depot-end-${vehicle.id}`,
          kind: 'depot-end',
          vehicleIndex: v,
          latitude: endLat,
          longitude: endLon,
        });
      }

      vehicleDepots.push({ startIndex, endIndex });
    }

    return { points, vehicleDepots };
  }

  private async loadAvailableVehicles(
    organizationId: string,
    vehicleIds: string[],
  ) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { organizationId, id: { in: vehicleIds } },
    });

    if (vehicles.length !== vehicleIds.length) {
      throw new BadRequestException('En eller flere kjøretøy ble ikke funnet');
    }

    const unavailable = vehicles.filter(
      (v) => v.status !== VehicleStatus.AVAILABLE,
    );
    if (unavailable.length > 0) {
      throw new BadRequestException(
        `Kun tilgjengelige kjøretøy kan brukes. Utilgjengelig: ${unavailable.map((v) => v.name).join(', ')}`,
      );
    }

    const order = new Map(vehicleIds.map((id, i) => [id, i]));
    return [...vehicles].sort(
      (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
    );
  }

  private async resolveDrivers(
    organizationId: string,
    vehicleIds: string[],
    driverIds?: string[],
  ): Promise<Array<string | null>> {
    const result: Array<string | null> = vehicleIds.map(() => null);

    if (!driverIds?.length) {
      return result;
    }

    if (driverIds.length > vehicleIds.length) {
      throw new BadRequestException(
        'driverIds kan ikke være flere enn vehicleIds',
      );
    }

    const uniqueDriverIds = [...new Set(driverIds)];
    const drivers = await this.prisma.driver.findMany({
      where: { organizationId, id: { in: uniqueDriverIds } },
    });

    if (drivers.length !== uniqueDriverIds.length) {
      throw new BadRequestException('En eller flere sjåfører ble ikke funnet');
    }

    const unavailable = drivers.filter(
      (d) => d.status !== DriverStatus.AVAILABLE,
    );
    if (unavailable.length > 0) {
      throw new BadRequestException(
        `Kun tilgjengelige sjåfører kan tildeles. Utilgjengelig: ${unavailable.map((d) => d.name).join(', ')}`,
      );
    }

    const usedDrivers = new Set<string>();
    for (let i = 0; i < driverIds.length; i += 1) {
      const id = driverIds[i];
      if (!id) {
        continue;
      }
      if (usedDrivers.has(id)) {
        throw new BadRequestException(
          'Samme sjåfør kan ikke tildeles flere kjøretøy i én jobb',
        );
      }
      usedDrivers.add(id);
      result[i] = id;
    }

    return result;
  }

  private async loadPendingDeliveries(
    organizationId: string,
    deliveryIds: string[],
  ) {
    const deliveries = await this.prisma.delivery.findMany({
      where: { organizationId, id: { in: deliveryIds } },
    });

    if (deliveries.length !== deliveryIds.length) {
      throw new BadRequestException('En eller flere leveringer ble ikke funnet');
    }

    const notPending = deliveries.filter(
      (d) => d.status !== DeliveryStatus.PENDING,
    );
    if (notPending.length > 0) {
      throw new BadRequestException(
        'Alle leveringer må ha status PENDING for optimalisering',
      );
    }

    const order = new Map(deliveryIds.map((id, i) => [id, i]));
    return [...deliveries].sort(
      (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
    );
  }

  private async validateCreateRequest(
    organizationId: string,
    dto: CreateOptimizationJobDto,
  ): Promise<OptimizationJobRequest> {
    const vehicleIds = dto.vehicleIds?.length
      ? [...new Set(dto.vehicleIds)]
      : dto.vehicleId
        ? [dto.vehicleId]
        : [];

    if (vehicleIds.length === 0) {
      throw new BadRequestException('Angi vehicleId eller vehicleIds');
    }

    await this.loadAvailableVehicles(organizationId, vehicleIds);

    if (dto.driverIds?.length) {
      await this.resolveDrivers(organizationId, vehicleIds, dto.driverIds);
    }

    const uniqueDeliveryIds = [...new Set(dto.deliveryIds)];
    if (uniqueDeliveryIds.length !== dto.deliveryIds.length) {
      throw new BadRequestException('Duplikate deliveryIds');
    }

    return {
      plannedDate: dto.plannedDate,
      vehicleIds,
      driverIds: dto.driverIds,
      deliveryIds: uniqueDeliveryIds,
      objective: dto.objective ?? OptimizationObjective.MINIMIZE_TOTAL_TIME,
      routeStartTime: dto.routeStartTime ?? '08:00',
      returnToDepot: dto.returnToDepot !== false,
      respectCapacity: dto.respectCapacity !== false,
      respectTimeWindows: dto.respectTimeWindows !== false,
    };
  }

  private toJobResponse(job: {
    id: string;
    organizationId: string;
    status: OptimizationJobStatus;
    objective: OptimizationObjective;
    plannedDate: Date;
    request: unknown;
    result: unknown;
    errorMessage: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): OptimizationJobResponse {
    return {
      id: job.id,
      organizationId: job.organizationId,
      status: job.status,
      objective: job.objective,
      plannedDate: job.plannedDate.toISOString().slice(0, 10),
      request: job.request as OptimizationJobRequest,
      result: job.result,
      errorMessage: job.errorMessage,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
