import { DeliveryStatus, RouteStatus, RouteStopStatus } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
export type DashboardAlertType = 'DEADLINE_AT_RISK' | 'OVER_CAPACITY' | 'NO_DRIVER' | 'FAILED_DELIVERY';
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
export type DriverLocationSnapshot = {
    latitude: number;
    longitude: number;
    recordedAt: Date;
    heading: number | null;
    speed: number | null;
};
export type LiveRouteResponse = {
    id: string;
    status: RouteStatus;
    plannedDate: Date;
    driver: {
        id: string;
        name: string;
        phone: string | null;
    } | null;
    driverLocation: DriverLocationSnapshot | null;
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
export declare class DashboardService {
    private readonly prisma;
    private readonly orgScope;
    constructor(prisma: PrismaService, orgScope: OrgScopeService);
    getSummary(user: JwtPayload, query: DashboardQueryDto): Promise<DashboardSummaryResponse>;
    getLiveRoutes(user: JwtPayload, query: DashboardQueryDto): Promise<LiveRouteResponse[]>;
    getDeliveriesStatus(user: JwtPayload, query: DashboardQueryDto): Promise<DashboardDeliveriesStatusResponse>;
    private resolvePlannedDate;
    private formatDate;
    private statusCountsToMetrics;
    private getRouteCounts;
    private loadRoutesForMetrics;
    private computeRouteAggregates;
    private countDelayedDeliveries;
    private findDelayedDeliveryRows;
    private isStopDelayed;
    private buildAlerts;
}
