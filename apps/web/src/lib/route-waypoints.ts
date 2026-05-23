import type { LiveRoute, RouteDetail } from '../types/domain'
import type { MapPoint } from './osrm-route'

export function buildRouteWaypoints(route: RouteDetail): MapPoint[] {
  const points: MapPoint[] = []

  if (route.vehicle) {
    points.push({
      latitude: route.vehicle.startLatitude,
      longitude: route.vehicle.startLongitude,
    })
  }

  for (const stop of route.stops) {
    points.push({
      latitude: stop.delivery.latitude,
      longitude: stop.delivery.longitude,
    })
  }

  if (route.vehicle) {
    const last = points.at(-1)
    const endLat = route.vehicle.endLatitude
    const endLon = route.vehicle.endLongitude
    const sameAsLast =
      last &&
      Math.abs(last.latitude - endLat) < 1e-6 &&
      Math.abs(last.longitude - endLon) < 1e-6

    if (!sameAsLast) {
      points.push({ latitude: endLat, longitude: endLon })
    } else if (points.length === 1) {
      points.push({ latitude: endLat, longitude: endLon })
    }
  }

  return points
}

export function buildLiveRouteWaypoints(route: LiveRoute): MapPoint[] {
  const points: MapPoint[] = []

  if (route.vehicle) {
    points.push({
      latitude: route.vehicle.startLatitude,
      longitude: route.vehicle.startLongitude,
    })
  }

  for (const stop of route.stops) {
    points.push({
      latitude: stop.delivery.latitude,
      longitude: stop.delivery.longitude,
    })
  }

  if (route.vehicle) {
    const endLat = route.vehicle.endLatitude
    const endLon = route.vehicle.endLongitude
    const last = points.at(-1)
    const sameAsLast =
      last &&
      Math.abs(last.latitude - endLat) < 1e-6 &&
      Math.abs(last.longitude - endLon) < 1e-6
    if (!sameAsLast) {
      points.push({ latitude: endLat, longitude: endLon })
    }
  }

  return points
}
