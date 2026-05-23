import { Injectable } from '@nestjs/common';
import {
  DeliveryStatus,
  DriverStatus,
  RouteStatus,
  RouteStopStatus,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

export type DashboardAlertType =
  | 'DEADLINE_AT_RISK'
  | 'OVER_CAPACITY'
  | 'NO_DRIVER'
  | 'FAILED_DELIVERY';

export type DashboardAlert = {
  type: DashboardAlertType;
  severity: 'warning' | 'error';
  message: string;
  deliveryId?: string;
  routeId?: string;
  driverId?: string;
};

export type DashboardSummaryResponse = {
  date: string;
  metrics: {
    deliveries: {
      total: number;
      pending: number;
      assigned: number;
      inProgress: number;
      delivered: number;
      failed: number;
      cancelled: number;
    };
    routes: {
      active: number;
      plannedToday: number;
      completedToday: number;
    };
    delayedDeliveries: number;
    averageRouteDurationSeconds: number | null;
    totalEstimatedDistanceMeters: number;
    capacityUtilizationPercent: number | null;
  };
  alerts: DashboardAlert[];
};

export type LiveRouteStop = {
  id: string;
  stopOrder: number;
  status: RouteStopStatus;
  estimatedArrival: Date | null;
  actualArrival: Date | null;
  isDelayed: boolean;
  delivery: {
    id: string;
    customerName: string;
    address: string;
    latitude: number;
    longitude: number;
    status: DeliveryStatus;
    priority: string;
    phone: string | null;
  };
};

export type LiveRouteResponse = {
  id: string;
  status: RouteStatus;
  plannedDate: Date;
  driver: { id: string; name: string; phone: string | null } | null;
  vehicle: {
    id: string;
    name: string;
    startLatitude: number;
    startLongitude: number;
    endLatitude: number;
    endLongitude: number;
    maxWeightKg: number;
  } | null;
  totalDistanceMeters: number | null;
  capacityUsedKg: number | null;
  stops: LiveRouteStop[];
  completedStops: number;
  totalStops: number;
};

export type DeliveryStatusBreakdown = {
  status: DeliveryStatus;
  count: number;
};

export type DashboardDeliveriesStatusResponse = {
  date: string;
  byStatus: DeliveryStatusBreakdown[];
  delayed: Array<{
    id: string;
    customerName: string;
    address: string;
    status: DeliveryStatus;
    deadline: Date | null;
    reason: string;
  }>;
};

const liveRouteInclude = {
  driver: true,
  vehicle: true,
  stops: {
    orderBy: { stopOrder: 'asc' as const },
    include: { delivery: true },
  },
};

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
  ) {}

  async getSummary(
    user: JwtPayload,
    query: DashboardQueryDto,
  ): Promise<DashboardSummaryResponse> {
    const plannedDate = this.resolvePlannedDate(query.date);
    const now = new Date();

    const [statusGroups, routeCounts, delayedCount, routesToday, alerts] =
      await Promise.all([
        this.prisma.delivery.groupBy({
          by: ['status'],
          where: this.orgScope.forOrganization(user),
          _count: { _all: true },
        }),
        this.getRouteCounts(user, plannedDate),
        this.countDelayedDeliveries(user, now),
        this.loadRoutesForMetrics(user, plannedDate),
        this.buildAlerts(user, plannedDate, now),
      ]);

    const deliveries = this.statusCountsToMetrics(statusGroups);
    const {
      averageRouteDurationSeconds,
      totalEstimatedDistanceMeters,
      capacityUtilizationPercent,
    } = this.computeRouteAggregates(routesToday);

    return {
      date: this.formatDate(plannedDate),
      metrics: {
        deliveries,
        routes: routeCounts,
        delayedDeliveries: delayedCount,
        averageRouteDurationSeconds,
        totalEstimatedDistanceMeters,
        capacityUtilizationPercent,
      },
      alerts,
    };
  }

  async getLiveRoutes(
    user: JwtPayload,
    query: DashboardQueryDto,
  ): Promise<LiveRouteResponse[]> {
    const plannedDate = this.resolvePlannedDate(query.date);
    const now = new Date();

    const rows = await this.prisma.route.findMany({
      where: this.orgScope.forOrganization(user, {
        plannedDate,
        status: { in: [RouteStatus.ASSIGNED, RouteStatus.IN_PROGRESS] },
      }),
      include: liveRouteInclude,
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    });

    return rows.map((route) => {
      const stops: LiveRouteStop[] = route.stops.map((stop) => ({
        id: stop.id,
        stopOrder: stop.stopOrder,
        status: stop.status,
        estimatedArrival: stop.estimatedArrival,
        actualArrival: stop.actualArrival,
        isDelayed: this.isStopDelayed(stop, now, route.status),
        delivery: {
          id: stop.delivery.id,
          customerName: stop.delivery.customerName,
          address: stop.delivery.address,
          latitude: decimalToNumber(stop.delivery.latitude)!,
          longitude: decimalToNumber(stop.delivery.longitude)!,
          status: stop.delivery.status,
          priority: stop.delivery.priority,
          phone: stop.delivery.phone,
        },
      }));

      return {
        id: route.id,
        status: route.status,
        plannedDate: route.plannedDate,
        driver: route.driver
          ? {
              id: route.driver.id,
              name: route.driver.name,
              phone: route.driver.phone,
            }
          : null,
        vehicle: route.vehicle
          ? {
              id: route.vehicle.id,
              name: route.vehicle.name,
              startLatitude: decimalToNumber(route.vehicle.startLatitude)!,
              startLongitude: decimalToNumber(route.vehicle.startLongitude)!,
              endLatitude: decimalToNumber(route.vehicle.endLatitude)!,
              endLongitude: decimalToNumber(route.vehicle.endLongitude)!,
              maxWeightKg: decimalToNumber(route.vehicle.maxWeightKg)!,
            }
          : null,
        totalDistanceMeters: route.totalDistanceMeters,
        capacityUsedKg:
          route.capacityUsedKg != null
            ? decimalToNumber(route.capacityUsedKg)
            : null,
        stops,
        completedStops: stops.filter((s) => s.status === RouteStopStatus.COMPLETED)
          .length,
        totalStops: stops.length,
      };
    });
  }

  async getDeliveriesStatus(
    user: JwtPayload,
    query: DashboardQueryDto,
  ): Promise<DashboardDeliveriesStatusResponse> {
    const plannedDate = this.resolvePlannedDate(query.date);
    const now = new Date();

    const [statusGroups, delayedRows] = await Promise.all([
      this.prisma.delivery.groupBy({
        by: ['status'],
        where: this.orgScope.forOrganization(user),
        _count: { _all: true },
      }),
      this.findDelayedDeliveryRows(user, now),
    ]);

    const byStatus: DeliveryStatusBreakdown[] = Object.values(
      DeliveryStatus,
    ).map((status) => ({
      status,
      count:
        statusGroups.find((g) => g.status === status)?._count._all ?? 0,
    }));

    return {
      date: this.formatDate(plannedDate),
      byStatus,
      delayed: delayedRows,
    };
  }

  private resolvePlannedDate(dateParam?: string): Date {
    if (dateParam) {
      const parsed = new Date(`${dateParam}T12:00:00.000Z`);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private statusCountsToMetrics(
    groups: Array<{ status: DeliveryStatus; _count: { _all: number } }>,
  ): DashboardSummaryResponse['metrics']['deliveries'] {
    const count = (status: DeliveryStatus) =>
      groups.find((g) => g.status === status)?._count._all ?? 0;

    const pending = count(DeliveryStatus.PENDING);
    const assigned = count(DeliveryStatus.ASSIGNED);
    const inProgress = count(DeliveryStatus.IN_PROGRESS);
    const delivered = count(DeliveryStatus.DELIVERED);
    const failed = count(DeliveryStatus.FAILED);
    const cancelled = count(DeliveryStatus.CANCELLED);

    return {
      total:
        pending +
        assigned +
        inProgress +
        delivered +
        failed +
        cancelled,
      pending,
      assigned,
      inProgress,
      delivered,
      failed,
      cancelled,
    };
  }

  private async getRouteCounts(
    user: JwtPayload,
    plannedDate: Date,
  ): Promise<DashboardSummaryResponse['metrics']['routes']> {
    const base = this.orgScope.forOrganization(user);

    const [active, plannedToday, completedToday] = await Promise.all([
      this.prisma.route.count({
        where: {
          ...base,
          status: { in: [RouteStatus.ASSIGNED, RouteStatus.IN_PROGRESS] },
        },
      }),
      this.prisma.route.count({
        where: { ...base, plannedDate },
      }),
      this.prisma.route.count({
        where: {
          ...base,
          plannedDate,
          status: RouteStatus.COMPLETED,
        },
      }),
    ]);

    return { active, plannedToday, completedToday };
  }

  private async loadRoutesForMetrics(user: JwtPayload, plannedDate: Date) {
    return this.prisma.route.findMany({
      where: this.orgScope.forOrganization(user, { plannedDate }),
      include: { vehicle: true },
    });
  }

  private computeRouteAggregates(
    routes: Awaited<ReturnType<typeof this.loadRoutesForMetrics>>,
  ): Pick<
    DashboardSummaryResponse['metrics'],
    | 'averageRouteDurationSeconds'
    | 'totalEstimatedDistanceMeters'
    | 'capacityUtilizationPercent'
  > {
    const completed = routes.filter(
      (r) =>
        r.status === RouteStatus.COMPLETED &&
        r.totalDurationSeconds != null,
    );

    const averageRouteDurationSeconds =
      completed.length > 0
        ? Math.round(
            completed.reduce((sum, r) => sum + (r.totalDurationSeconds ?? 0), 0) /
              completed.length,
          )
        : null;

    const totalEstimatedDistanceMeters = routes.reduce(
      (sum, r) => sum + (r.totalDistanceMeters ?? 0),
      0,
    );

    const withCapacity = routes.filter(
      (r) => r.capacityUsedKg != null && r.vehicle != null,
    );

    let capacityUtilizationPercent: number | null = null;
    if (withCapacity.length > 0) {
      const utilizations = withCapacity.map((r) => {
        const used = decimalToNumber(r.capacityUsedKg)!;
        const max = decimalToNumber(r.vehicle!.maxWeightKg)!;
        return max > 0 ? (used / max) * 100 : 0;
      });
      capacityUtilizationPercent = Math.round(
        utilizations.reduce((a, b) => a + b, 0) / utilizations.length,
      );
    }

    return {
      averageRouteDurationSeconds,
      totalEstimatedDistanceMeters,
      capacityUtilizationPercent,
    };
  }

  private async countDelayedDeliveries(
    user: JwtPayload,
    now: Date,
  ): Promise<number> {
    const rows = await this.findDelayedDeliveryRows(user, now);
    return rows.length;
  }

  private async findDelayedDeliveryRows(
    user: JwtPayload,
    now: Date,
  ): Promise<DashboardDeliveriesStatusResponse['delayed']> {
    const orgWhere = this.orgScope.forOrganization(user);
    const atRiskThreshold = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const deliveries = await this.prisma.delivery.findMany({
      where: {
        ...orgWhere,
        status: {
          in: [
            DeliveryStatus.PENDING,
            DeliveryStatus.ASSIGNED,
            DeliveryStatus.IN_PROGRESS,
          ],
        },
        OR: [
          { deadline: { lt: now } },
          { deadline: { lte: atRiskThreshold, gte: now } },
        ],
      },
      select: {
        id: true,
        customerName: true,
        address: true,
        status: true,
        deadline: true,
      },
      take: 50,
      orderBy: { deadline: 'asc' },
    });

    const overdueStops = await this.prisma.routeStop.findMany({
      where: {
        status: { in: [RouteStopStatus.PENDING, RouteStopStatus.IN_PROGRESS] },
        estimatedArrival: { lt: now },
        route: {
          ...orgWhere,
          status: RouteStatus.IN_PROGRESS,
        },
      },
      include: {
        delivery: {
          select: {
            id: true,
            customerName: true,
            address: true,
            status: true,
            deadline: true,
          },
        },
      },
      take: 50,
    });

    const delayed: DashboardDeliveriesStatusResponse['delayed'] = [];
    const seen = new Set<string>();

    for (const d of deliveries) {
      if (seen.has(d.id)) continue;
      seen.add(d.id);
      const past = d.deadline && d.deadline < now;
      delayed.push({
        id: d.id,
        customerName: d.customerName,
        address: d.address,
        status: d.status,
        deadline: d.deadline,
        reason: past
          ? 'Deadline er passert'
          : 'Deadline innen 2 timer',
      });
    }

    for (const stop of overdueStops) {
      const d = stop.delivery;
      if (seen.has(d.id)) continue;
      seen.add(d.id);
      delayed.push({
        id: d.id,
        customerName: d.customerName,
        address: d.address,
        status: d.status,
        deadline: d.deadline,
        reason: 'Estimert ankomst er passert',
      });
    }

    return delayed;
  }

  private isStopDelayed(
    stop: {
      status: RouteStopStatus;
      estimatedArrival: Date | null;
    },
    now: Date,
    routeStatus: RouteStatus,
  ): boolean {
    if (routeStatus !== RouteStatus.IN_PROGRESS) {
      return false;
    }
    if (
      stop.status !== RouteStopStatus.PENDING &&
      stop.status !== RouteStopStatus.IN_PROGRESS
    ) {
      return false;
    }
    return stop.estimatedArrival != null && stop.estimatedArrival < now;
  }

  private async buildAlerts(
    user: JwtPayload,
    plannedDate: Date,
    now: Date,
  ): Promise<DashboardAlert[]> {
    const alerts: DashboardAlert[] = [];
    const orgWhere = this.orgScope.forOrganization(user);
    const atRiskThreshold = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const deadlineAtRisk = await this.prisma.delivery.findMany({
      where: {
        ...orgWhere,
        status: {
          in: [
            DeliveryStatus.PENDING,
            DeliveryStatus.ASSIGNED,
            DeliveryStatus.IN_PROGRESS,
          ],
        },
        deadline: { lte: atRiskThreshold },
      },
      select: { id: true, customerName: true, deadline: true },
      take: 20,
      orderBy: { deadline: 'asc' },
    });

    for (const d of deadlineAtRisk) {
      const past = d.deadline && d.deadline < now;
      alerts.push({
        type: 'DEADLINE_AT_RISK',
        severity: past ? 'error' : 'warning',
        message: past
          ? `${d.customerName}: deadline er passert`
          : `${d.customerName}: deadline nærmer seg`,
        deliveryId: d.id,
      });
    }

    const routesWithCapacity = await this.prisma.route.findMany({
      where: {
        ...orgWhere,
        plannedDate,
        capacityUsedKg: { not: null },
        vehicleId: { not: null },
      },
      include: { vehicle: true },
      take: 30,
    });

    for (const route of routesWithCapacity) {
      if (!route.vehicle || route.capacityUsedKg == null) continue;
      const used = decimalToNumber(route.capacityUsedKg)!;
      const max = decimalToNumber(route.vehicle.maxWeightKg)!;
      if (used > max) {
        alerts.push({
          type: 'OVER_CAPACITY',
          severity: 'error',
          message: `Rute ${route.id.slice(-6)}: ${route.vehicle.name} over max vekt (${used.toFixed(0)} / ${max.toFixed(0)} kg)`,
          routeId: route.id,
        });
      }
    }

    const routesWithoutDriver = await this.prisma.route.count({
      where: {
        ...orgWhere,
        plannedDate,
        driverId: null,
        status: {
          in: [RouteStatus.PLANNED, RouteStatus.ASSIGNED],
        },
      },
    });

    if (routesWithoutDriver > 0) {
      alerts.push({
        type: 'NO_DRIVER',
        severity: 'warning',
        message: `${routesWithoutDriver} rute(r) mangler tildelt sjåfør`,
      });
    }

    const pendingCount = await this.prisma.delivery.count({
      where: { ...orgWhere, status: DeliveryStatus.PENDING },
    });

    const availableDrivers = await this.prisma.driver.count({
      where: {
        ...orgWhere,
        status: DriverStatus.AVAILABLE,
      },
    });

    if (pendingCount > 0 && availableDrivers === 0) {
      alerts.push({
        type: 'NO_DRIVER',
        severity: 'warning',
        message: 'Ingen tilgjengelige sjåfører for nye tildelinger',
      });
    }

    const failedDeliveries = await this.prisma.delivery.findMany({
      where: { ...orgWhere, status: DeliveryStatus.FAILED },
      select: { id: true, customerName: true },
      take: 20,
      orderBy: { updatedAt: 'desc' },
    });

    for (const d of failedDeliveries) {
      alerts.push({
        type: 'FAILED_DELIVERY',
        severity: 'error',
        message: `${d.customerName}: levering mislyktes — krever oppfølging`,
        deliveryId: d.id,
      });
    }

    return alerts;
  }
}
