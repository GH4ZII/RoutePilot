import { DeliveryPriority } from '../generated/prisma/client';
import type { RoutingPoint } from '../routing/routing.types';
export declare const SERVICE_TIME_SEC = 120;
export declare const HORIZON_SEC = 86400;
export type DepotPointKind = 'depot-start' | 'depot-end';
export type MatrixPoint = RoutingPoint & {
    kind: 'delivery' | DepotPointKind;
    deliveryIndex?: number;
    vehicleIndex?: number;
};
export declare function weightToUnits(kg: number): number;
export declare function volumeToUnits(m3: number | null | undefined): number;
export declare function dropPenaltyForPriority(priority: DeliveryPriority): number;
export declare function parseRouteStart(plannedDate: string, routeStartTime: string): Date;
export declare function secondsFromRouteStart(routeStart: Date, value: Date | null | undefined): number | null;
export declare function extractDeliveryVisitOrder(routeIndices: number[], points: MatrixPoint[]): number[];
export declare function computeLegMetrics(routeIndices: number[], matrix: {
    distancesMeters: number[][];
    durationsSeconds: number[][];
}, routeStart: Date): {
    totalDistanceMeters: number;
    totalDurationSeconds: number;
    stopEtas: Map<number, Date>;
};
