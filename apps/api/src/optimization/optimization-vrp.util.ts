import { DeliveryPriority } from '../generated/prisma/client';
import type { RoutingPoint } from '../routing/routing.types';

export const SERVICE_TIME_SEC = 120;
export const HORIZON_SEC = 86_400;

const PRIORITY_DROP_PENALTY: Record<DeliveryPriority, number> = {
  LOW: 10_000,
  NORMAL: 100_000,
  HIGH: 1_000_000,
  CRITICAL: 10_000_000,
};

export type DepotPointKind = 'depot-start' | 'depot-end';

export type MatrixPoint = RoutingPoint & {
  kind: 'delivery' | DepotPointKind;
  deliveryIndex?: number;
  vehicleIndex?: number;
};

export function weightToUnits(kg: number): number {
  return Math.max(0, Math.round(kg * 100));
}

export function volumeToUnits(m3: number | null | undefined): number {
  if (m3 == null) {
    return 0;
  }
  return Math.max(0, Math.round(m3 * 1000));
}

export function dropPenaltyForPriority(priority: DeliveryPriority): number {
  return PRIORITY_DROP_PENALTY[priority];
}

export function parseRouteStart(plannedDate: string, routeStartTime: string): Date {
  const [hours, minutes] = routeStartTime.split(':').map(Number);
  const [year, month, day] = plannedDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
}

export function secondsFromRouteStart(
  routeStart: Date,
  value: Date | null | undefined,
): number | null {
  if (!value) {
    return null;
  }
  const sec = Math.floor((value.getTime() - routeStart.getTime()) / 1000);
  return sec < 0 ? 0 : sec;
}

export function extractDeliveryVisitOrder(
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

export function computeLegMetrics(
  routeIndices: number[],
  matrix: {
    distancesMeters: number[][];
    durationsSeconds: number[][];
  },
  routeStart: Date,
) {
  let totalDistanceMeters = 0;
  let totalDurationSeconds = 0;
  const stopEtas = new Map<number, Date>();
  let currentTime = routeStart;

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
