import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  DeliveryStatus,
  OptimizationJobStatus,
  OptimizationObjective,
  RouteStatus,
  RouteStopStatus,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoutingService } from '../routing/routing.service';
import type { RoutingPoint } from '../routing/routing.types';
import { CreateOptimizationJobDto } from './dto/create-optimization-job.dto';
import { OptimizerClientService } from './optimizer-client.service';

export const OPTIMIZATION_QUEUE = 'optimization';

type OptimizationJobRequest = {
  plannedDate: string;
  vehicleId: string;
  driverId?: string;
  deliveryIds: string[];
  objective: OptimizationObjective;
  routeStartTime: string;
  returnToDepot: boolean;
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

type DepotPointKind = 'depot-start' | 'depot-end';

type MatrixPoint = RoutingPoint & {
  kind: 'delivery' | DepotPointKind;
  deliveryId?: string;
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
      const result = await this.executeOptimization(organizationId, request);

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

  private async executeOptimization(
    organizationId: string,
    request: OptimizationJobRequest,
  ) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: request.vehicleId, organizationId },
    });
    if (!vehicle) {
      throw new BadRequestException('Kjøretøy ikke funnet');
    }

    if (request.driverId) {
      const driver = await this.prisma.driver.findFirst({
        where: { id: request.driverId, organizationId },
      });
      if (!driver) {
        throw new BadRequestException('Sjåfør ikke funnet');
      }
    }

    const deliveries = await this.prisma.delivery.findMany({
      where: {
        organizationId,
        id: { in: request.deliveryIds },
      },
    });

    if (deliveries.length !== request.deliveryIds.length) {
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

    const startLat = decimalToNumber(vehicle.startLatitude)!;
    const startLon = decimalToNumber(vehicle.startLongitude)!;
    const endLat = decimalToNumber(vehicle.endLatitude)!;
    const endLon = decimalToNumber(vehicle.endLongitude)!;

    const points: MatrixPoint[] = [
      {
        id: 'depot-start',
        kind: 'depot-start',
        latitude: startLat,
        longitude: startLon,
      },
      ...deliveries.map((d) => ({
        id: d.id,
        kind: 'delivery' as const,
        deliveryId: d.id,
        latitude: decimalToNumber(d.latitude)!,
        longitude: decimalToNumber(d.longitude)!,
      })),
    ];

    const returnToDepot = request.returnToDepot !== false;
    const endDiffers =
      Math.abs(startLat - endLat) > 1e-6 ||
      Math.abs(startLon - endLon) > 1e-6;
    if (returnToDepot && endDiffers) {
      points.push({
        id: 'depot-end',
        kind: 'depot-end',
        latitude: endLat,
        longitude: endLon,
      });
    }

    const matrix = await this.routing.buildDistanceTimeMatrix(points);
    const costMatrix =
      request.objective === OptimizationObjective.MINIMIZE_TOTAL_DISTANCE
        ? matrix.distancesMeters
        : matrix.durationsSeconds;

    const { routeIndices, totalCost } =
      await this.optimizer.solveTsp(costMatrix);

    const visitIndices = this.extractDeliveryVisitOrder(routeIndices, points);
    if (visitIndices.length === 0) {
      throw new BadRequestException('Optimalisering returnerte ingen leveringsstopp');
    }

    const { totalDistanceMeters, totalDurationSeconds, stopEtas } =
      this.computeLegMetrics(routeIndices, matrix, request);

    const route = await this.prisma.$transaction(async (tx) => {
      const createdRoute = await tx.route.create({
        data: {
          organizationId,
          vehicleId: vehicle.id,
          driverId: request.driverId ?? null,
          status: RouteStatus.PLANNED,
          plannedDate: new Date(`${request.plannedDate}T12:00:00.000Z`),
          totalDistanceMeters,
          totalDurationSeconds,
          capacityUsedKg: deliveries.reduce(
            (sum, d) => sum + Number(d.weightKg),
            0,
          ),
        },
      });

      let stopOrder = 1;
      for (const pointIndex of visitIndices) {
        const point = points[pointIndex];
        if (point.kind !== 'delivery' || !point.deliveryId) {
          continue;
        }
        await tx.routeStop.create({
          data: {
            routeId: createdRoute.id,
            deliveryId: point.deliveryId,
            stopOrder,
            estimatedArrival: stopEtas.get(pointIndex) ?? null,
            status: RouteStopStatus.PENDING,
          },
        });
        await tx.delivery.update({
          where: { id: point.deliveryId },
          data: { status: DeliveryStatus.ASSIGNED },
        });
        stopOrder += 1;
      }

      return createdRoute;
    });

    const orderedStops: Array<{
      deliveryId: string;
      order: number;
      estimatedArrival: string | null;
    }> = [];
    let order = 1;
    for (const pointIndex of visitIndices) {
      const point = points[pointIndex];
      if (point.kind !== 'delivery' || !point.deliveryId) {
        continue;
      }
      orderedStops.push({
        deliveryId: point.deliveryId,
        order,
        estimatedArrival: stopEtas.get(pointIndex)?.toISOString() ?? null,
      });
      order += 1;
    }

    return {
      routes: [
        {
          routeId: route.id,
          driverId: request.driverId ?? null,
          vehicleId: vehicle.id,
          totalDistanceMeters,
          totalDurationSeconds,
          optimizerCost: totalCost,
          stops: orderedStops,
        },
      ],
      unassignedDeliveries: [] as string[],
      warnings: [] as string[],
    };
  }

  private extractDeliveryVisitOrder(
    routeIndices: number[],
    points: MatrixPoint[],
  ): number[] {
    const seen = new Set<number>();
    const order: number[] = [];
    for (const idx of routeIndices) {
      if (seen.has(idx)) {
        continue;
      }
      seen.add(idx);
      if (points[idx]?.kind === 'delivery') {
        order.push(idx);
      }
    }
    return order;
  }

  private computeLegMetrics(
    routeIndices: number[],
    matrix: Awaited<ReturnType<RoutingService['buildDistanceTimeMatrix']>>,
    request: OptimizationJobRequest,
  ) {
    const startAt = this.parseRouteStart(
      request.plannedDate,
      request.routeStartTime,
    );
    let totalDistanceMeters = 0;
    let totalDurationSeconds = 0;
    const stopEtas = new Map<number, Date>();
    let currentTime = startAt;

    for (let i = 0; i < routeIndices.length - 1; i += 1) {
      const from = routeIndices[i];
      const to = routeIndices[i + 1];
      const dist = matrix.distancesMeters[from]?.[to] ?? 0;
      const dur = matrix.durationsSeconds[from]?.[to] ?? 0;
      totalDistanceMeters += dist;
      totalDurationSeconds += dur;
      currentTime = new Date(currentTime.getTime() + dur * 1000);
      stopEtas.set(to, new Date(currentTime));
    }

    return { totalDistanceMeters, totalDurationSeconds, stopEtas };
  }

  private parseRouteStart(plannedDate: string, routeStartTime: string): Date {
    const [hours, minutes] = routeStartTime.split(':').map(Number);
    const [year, month, day] = plannedDate.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  }

  private async validateCreateRequest(
    organizationId: string,
    dto: CreateOptimizationJobDto,
  ): Promise<OptimizationJobRequest> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: dto.vehicleId, organizationId },
    });
    if (!vehicle) {
      throw new BadRequestException('Kjøretøy ikke funnet');
    }

    if (dto.driverId) {
      const driver = await this.prisma.driver.findFirst({
        where: { id: dto.driverId, organizationId },
      });
      if (!driver) {
        throw new BadRequestException('Sjåfør ikke funnet');
      }
    }

    const uniqueIds = [...new Set(dto.deliveryIds)];
    if (uniqueIds.length !== dto.deliveryIds.length) {
      throw new BadRequestException('Duplikate deliveryIds');
    }

    return {
      plannedDate: dto.plannedDate,
      vehicleId: dto.vehicleId,
      driverId: dto.driverId,
      deliveryIds: uniqueIds,
      objective: dto.objective ?? OptimizationObjective.MINIMIZE_TOTAL_TIME,
      routeStartTime: dto.routeStartTime ?? '08:00',
      returnToDepot: dto.returnToDepot !== false,
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
