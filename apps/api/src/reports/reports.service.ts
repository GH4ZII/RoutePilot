import { Injectable } from '@nestjs/common';
import {
  DeliveryStatus,
  RouteStatus,
  RouteStopStatus,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import {
  arrivalDeltaMinutes,
  formatDate,
  isOnTime,
  resolveDateRange,
  resolvePlannedDate,
} from '../common/report-date.util';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { DailyReportQueryDto } from './dto/reports-query.dto';
import { RangeReportQueryDto } from './dto/reports-query.dto';

export type DailyReportResponse = {
  date: string;
  deliveries: {
    pending: number;
    assigned: number;
    inProgress: number;
    delivered: number;
    failed: number;
    cancelled: number;
    total: number;
  };
  routes: {
    planned: number;
    completed: number;
    active: number;
  };
  totals: {
    distanceMeters: number;
    durationSeconds: number;
    stopsCompleted: number;
    stopsFailed: number;
  };
  onTimeRate: number | null;
};

export type DriverPerformanceRow = {
  driverId: string;
  name: string;
  routesCompleted: number;
  stopsCompleted: number;
  stopsFailed: number;
  onTimePercent: number | null;
  avgDelayMinutes: number | null;
};

export type DriverPerformanceResponse = {
  from: string;
  to: string;
  drivers: DriverPerformanceRow[];
};

export type RouteEfficiencyRow = {
  routeId: string;
  plannedDate: string;
  driver: { id: string; name: string } | null;
  vehicle: { id: string; name: string } | null;
  plannedDistanceMeters: number | null;
  actualDurationSeconds: number | null;
  capacityUtilizationPercent: number | null;
  stopCompletionRate: number | null;
  avgArrivalDeltaMinutes: number | null;
};

export type RouteEfficiencyResponse = {
  from: string;
  to: string;
  routes: RouteEfficiencyRow[];
};

export type PlannedVsActualStopRow = {
  stopId: string;
  stopOrder: number;
  customerName: string;
  estimatedArrival: Date | null;
  actualArrival: Date | null;
  deltaMinutes: number | null;
};

export type PlannedVsActualRouteRow = {
  routeId: string;
  plannedDate: string;
  plannedDistanceMeters: number | null;
  actualDistanceMeters: number | null;
  plannedDurationSeconds: number | null;
  actualDurationSeconds: number | null;
  stops: PlannedVsActualStopRow[];
};

export type PlannedVsActualResponse = {
  from: string;
  to: string;
  routes: PlannedVsActualRouteRow[];
};

const routeWithStopsInclude = {
  driver: true,
  vehicle: true,
  stops: {
    include: { delivery: true },
    orderBy: { stopOrder: 'asc' as const },
  },
};

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
  ) {}

  async getDaily(
    user: JwtPayload,
    query: DailyReportQueryDto,
  ): Promise<DailyReportResponse> {
    const plannedDate = resolvePlannedDate(query.date);
    const orgWhere = this.orgScope.forOrganization(user);

    const routes = await this.prisma.route.findMany({
      where: { ...orgWhere, plannedDate },
      include: routeWithStopsInclude,
    });

    const deliveryStatusMap = new Map<DeliveryStatus, number>();
    for (const status of Object.values(DeliveryStatus)) {
      deliveryStatusMap.set(status, 0);
    }

    let stopsCompleted = 0;
    let stopsFailed = 0;
    let onTimeCount = 0;
    let onTimeEligible = 0;

    for (const route of routes) {
      const seenDeliveries = new Set<string>();
      for (const stop of route.stops) {
        if (!seenDeliveries.has(stop.deliveryId)) {
          seenDeliveries.add(stop.deliveryId);
          const status = stop.delivery.status;
          deliveryStatusMap.set(status, (deliveryStatusMap.get(status) ?? 0) + 1);
        }

        if (stop.status === RouteStopStatus.COMPLETED) {
          stopsCompleted += 1;
          const onTimeResult = isOnTime(stop.estimatedArrival, stop.actualArrival);
          if (onTimeResult != null) {
            onTimeEligible += 1;
            if (onTimeResult) onTimeCount += 1;
          }
        } else if (stop.status === RouteStopStatus.FAILED) {
          stopsFailed += 1;
        }
      }
    }

    const pending = deliveryStatusMap.get(DeliveryStatus.PENDING) ?? 0;
    const assigned = deliveryStatusMap.get(DeliveryStatus.ASSIGNED) ?? 0;
    const inProgress = deliveryStatusMap.get(DeliveryStatus.IN_PROGRESS) ?? 0;
    const delivered = deliveryStatusMap.get(DeliveryStatus.DELIVERED) ?? 0;
    const failed = deliveryStatusMap.get(DeliveryStatus.FAILED) ?? 0;
    const cancelled = deliveryStatusMap.get(DeliveryStatus.CANCELLED) ?? 0;

    const planned = routes.length;
    const completed = routes.filter((r) => r.status === RouteStatus.COMPLETED).length;
    const active = routes.filter(
      (r) =>
        r.status === RouteStatus.ASSIGNED ||
        r.status === RouteStatus.IN_PROGRESS,
    ).length;

    const distanceMeters = routes.reduce(
      (sum, r) => sum + (r.totalDistanceMeters ?? 0),
      0,
    );
    const durationSeconds = routes.reduce(
      (sum, r) => sum + (r.totalDurationSeconds ?? 0),
      0,
    );

    return {
      date: formatDate(plannedDate),
      deliveries: {
        pending,
        assigned,
        inProgress,
        delivered,
        failed,
        cancelled,
        total: pending + assigned + inProgress + delivered + failed + cancelled,
      },
      routes: { planned, completed, active },
      totals: {
        distanceMeters,
        durationSeconds,
        stopsCompleted,
        stopsFailed,
      },
      onTimeRate:
        onTimeEligible > 0
          ? Math.round((onTimeCount / onTimeEligible) * 1000) / 10
          : null,
    };
  }

  async getDriverPerformance(
    user: JwtPayload,
    query: RangeReportQueryDto,
  ): Promise<DriverPerformanceResponse> {
    const { from, to } = resolveDateRange(query.from, query.to);
    const orgWhere = this.orgScope.forOrganization(user);

    const routes = await this.prisma.route.findMany({
      where: {
        ...orgWhere,
        plannedDate: { gte: from, lte: to },
        ...(query.driverId
          ? { driverId: query.driverId }
          : { driverId: { not: null } }),
      },
      include: {
        driver: true,
        stops: true,
      },
    });

    const byDriver = new Map<
      string,
      {
        name: string;
        routesCompleted: number;
        stopsCompleted: number;
        stopsFailed: number;
        onTime: number;
        onTimeEligible: number;
        delaySum: number;
        delayCount: number;
      }
    >();

    for (const route of routes) {
      if (!route.driverId || !route.driver) continue;

      let agg = byDriver.get(route.driverId);
      if (!agg) {
        agg = {
          name: route.driver.name,
          routesCompleted: 0,
          stopsCompleted: 0,
          stopsFailed: 0,
          onTime: 0,
          onTimeEligible: 0,
          delaySum: 0,
          delayCount: 0,
        };
        byDriver.set(route.driverId, agg);
      }

      if (route.status === RouteStatus.COMPLETED) {
        agg.routesCompleted += 1;
      }

      for (const stop of route.stops) {
        if (stop.status === RouteStopStatus.COMPLETED) {
          agg.stopsCompleted += 1;
          const onTimeResult = isOnTime(stop.estimatedArrival, stop.actualArrival);
          if (onTimeResult != null) {
            agg.onTimeEligible += 1;
            if (onTimeResult) agg.onTime += 1;
          }
          const delta = arrivalDeltaMinutes(
            stop.estimatedArrival,
            stop.actualArrival,
          );
          if (delta != null) {
            agg.delaySum += delta;
            agg.delayCount += 1;
          }
        } else if (stop.status === RouteStopStatus.FAILED) {
          agg.stopsFailed += 1;
        }
      }
    }

    const drivers: DriverPerformanceRow[] = [...byDriver.entries()]
      .map(([driverId, agg]) => ({
        driverId,
        name: agg.name,
        routesCompleted: agg.routesCompleted,
        stopsCompleted: agg.stopsCompleted,
        stopsFailed: agg.stopsFailed,
        onTimePercent:
          agg.onTimeEligible > 0
            ? Math.round((agg.onTime / agg.onTimeEligible) * 1000) / 10
            : null,
        avgDelayMinutes:
          agg.delayCount > 0
            ? Math.round((agg.delaySum / agg.delayCount) * 10) / 10
            : null,
      }))
      .sort((a, b) => b.stopsCompleted - a.stopsCompleted);

    return {
      from: formatDate(from),
      to: formatDate(to),
      drivers,
    };
  }

  async getRouteEfficiency(
    user: JwtPayload,
    query: RangeReportQueryDto,
  ): Promise<RouteEfficiencyResponse> {
    const { from, to } = resolveDateRange(query.from, query.to);
    const orgWhere = this.orgScope.forOrganization(user);

    const routes = await this.prisma.route.findMany({
      where: {
        ...orgWhere,
        plannedDate: { gte: from, lte: to },
        status: RouteStatus.COMPLETED,
        ...(query.driverId ? { driverId: query.driverId } : {}),
      },
      include: routeWithStopsInclude,
      orderBy: { plannedDate: 'desc' },
    });

    const rows: RouteEfficiencyRow[] = routes.map((route) => {
      const totalStops = route.stops.length;
      const completedStops = route.stops.filter(
        (s) => s.status === RouteStopStatus.COMPLETED,
      ).length;

      const deltas: number[] = [];
      for (const stop of route.stops) {
        if (stop.status !== RouteStopStatus.COMPLETED) continue;
        const delta = arrivalDeltaMinutes(
          stop.estimatedArrival,
          stop.actualArrival,
        );
        if (delta != null) deltas.push(delta);
      }

      let capacityUtilizationPercent: number | null = null;
      if (route.capacityUsedKg != null && route.vehicle) {
        const used = decimalToNumber(route.capacityUsedKg)!;
        const max = decimalToNumber(route.vehicle.maxWeightKg)!;
        capacityUtilizationPercent =
          max > 0 ? Math.round((used / max) * 1000) / 10 : 0;
      }

      let actualDurationSeconds: number | null = null;
      if (route.startedAt && route.finishedAt) {
        actualDurationSeconds = Math.round(
          (route.finishedAt.getTime() - route.startedAt.getTime()) / 1000,
        );
      } else if (route.totalDurationSeconds != null) {
        actualDurationSeconds = route.totalDurationSeconds;
      }

      return {
        routeId: route.id,
        plannedDate: formatDate(route.plannedDate),
        driver: route.driver
          ? { id: route.driver.id, name: route.driver.name }
          : null,
        vehicle: route.vehicle
          ? { id: route.vehicle.id, name: route.vehicle.name }
          : null,
        plannedDistanceMeters: route.totalDistanceMeters,
        actualDurationSeconds,
        capacityUtilizationPercent,
        stopCompletionRate:
          totalStops > 0
            ? Math.round((completedStops / totalStops) * 1000) / 10
            : null,
        avgArrivalDeltaMinutes:
          deltas.length > 0
            ? Math.round(
                (deltas.reduce((a, b) => a + b, 0) / deltas.length) * 10,
              ) / 10
            : null,
      };
    });

    return {
      from: formatDate(from),
      to: formatDate(to),
      routes: rows,
    };
  }

  async getPlannedVsActual(
    user: JwtPayload,
    query: RangeReportQueryDto,
  ): Promise<PlannedVsActualResponse> {
    const { from, to } = resolveDateRange(query.from, query.to);
    const orgWhere = this.orgScope.forOrganization(user);

    const routes = await this.prisma.route.findMany({
      where: {
        ...orgWhere,
        plannedDate: { gte: from, lte: to },
        ...(query.driverId ? { driverId: query.driverId } : {}),
      },
      include: routeWithStopsInclude,
      orderBy: { plannedDate: 'desc' },
    });

    const rows: PlannedVsActualRouteRow[] = routes.map((route) => ({
      routeId: route.id,
      plannedDate: formatDate(route.plannedDate),
      plannedDistanceMeters: route.totalDistanceMeters,
      actualDistanceMeters: route.actualDistanceMeters,
      plannedDurationSeconds: route.totalDurationSeconds,
      actualDurationSeconds:
        route.actualDurationSeconds ??
        (route.startedAt && route.finishedAt
          ? Math.round(
              (route.finishedAt.getTime() - route.startedAt.getTime()) / 1000,
            )
          : null),
      stops: route.stops.map((stop) => ({
        stopId: stop.id,
        stopOrder: stop.stopOrder,
        customerName: stop.delivery.customerName,
        estimatedArrival: stop.estimatedArrival,
        actualArrival: stop.actualArrival,
        deltaMinutes: arrivalDeltaMinutes(
          stop.estimatedArrival,
          stop.actualArrival,
        ),
      })),
    }));

    return {
      from: formatDate(from),
      to: formatDate(to),
      routes: rows,
    };
  }
}
