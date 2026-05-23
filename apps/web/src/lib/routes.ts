import type {
  OptimizationJob,
  OptimizationRouteResult,
  RouteDetail,
} from '../types/domain'

export function isArchivedRoute(route: RouteDetail): boolean {
  return route.status === 'COMPLETED'
}

export function getActiveRoutes(routes: RouteDetail[]): RouteDetail[] {
  return routes.filter((route) => !isArchivedRoute(route))
}

export function getArchivedDeliveryIds(routes: RouteDetail[]): Set<string> {
  return new Set(
    routes
      .filter(isArchivedRoute)
      .flatMap((route) => route.stops.map((stop) => stop.delivery.id)),
  )
}

export function routeDetailToJobShape(
  route: RouteDetail,
): { job: OptimizationJob; route: OptimizationRouteResult } {
  return {
    job: {
      id: '',
      organizationId: route.organizationId,
      status: 'COMPLETED',
      objective: 'MINIMIZE_TOTAL_TIME',
      plannedDate: route.plannedDate.slice(0, 10),
      request: {
        plannedDate: route.plannedDate.slice(0, 10),
        vehicleIds: route.vehicleId ? [route.vehicleId] : [],
        deliveryIds: route.stops.map((s) => s.delivery.id),
      },
      result: null,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
    },
    route: {
      routeId: route.id,
      driverId: route.driverId,
      vehicleId: route.vehicleId ?? '',
      totalDistanceMeters: route.totalDistanceMeters ?? 0,
      totalDurationSeconds: route.totalDurationSeconds ?? 0,
      stops: route.stops.map((s) => ({
        deliveryId: s.delivery.id,
        order: s.stopOrder,
        estimatedArrival: s.estimatedArrival,
      })),
    },
  }
}
