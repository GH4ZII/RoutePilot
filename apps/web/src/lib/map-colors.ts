import type { DeliveryStatus, RouteStopStatus } from '../types/domain'

export const DELIVERY_MARKER_COLORS: Record<DeliveryStatus, string> = {
  PENDING: '#64748b',
  ASSIGNED: '#4f46e5',
  IN_PROGRESS: '#2563eb',
  DELIVERED: '#16a34a',
  FAILED: '#dc2626',
  CANCELLED: '#94a3b8',
}

export const DEPOT_MARKER_COLOR = '#7c3aed'

export const DRIVER_MARKER_COLOR = '#0284c7'

export const ROUTE_LINE_COLOR = '#4f46e5'

export const ROUTE_STOP_MARKER_COLORS: Record<RouteStopStatus, string> = {
  PENDING: ROUTE_LINE_COLOR,
  IN_PROGRESS: '#2563eb',
  COMPLETED: '#16a34a',
  FAILED: '#dc2626',
  SKIPPED: '#94a3b8',
}

/** Distinct colors for multiple live routes on the dashboard map. */
export const LIVE_ROUTE_COLORS = [
  '#4f46e5',
  '#0891b2',
  '#16a34a',
  '#d97706',
  '#db2777',
  '#7c3aed',
  '#0d9488',
  '#ea580c',
] as const

/** Stable color from a route's index in the full live-routes list (not visibility filter). */
export function liveRouteColorForIndex(index: number): string {
  return LIVE_ROUTE_COLORS[index % LIVE_ROUTE_COLORS.length] ?? LIVE_ROUTE_COLORS[0]
}

export function liveRouteColorForRoute(
  routeId: string,
  routes: readonly { id: string }[],
): string {
  const index = routes.findIndex((r) => r.id === routeId)
  return liveRouteColorForIndex(index >= 0 ? index : 0)
}
