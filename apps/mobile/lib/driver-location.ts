import * as Location from 'expo-location';
import * as api from '@/lib/api';
import type { DriverRoute } from '@/types/routes';

const INTERVAL_MS = 30_000;
const SIMULATE_INTERVAL_MS = 5_000;

const simulateDriverLocation =
  __DEV__ &&
  process.env.EXPO_PUBLIC_SIMULATE_DRIVER_LOCATION === 'true';

type LatLng = { latitude: number; longitude: number };

function buildSimulationWaypoints(route: DriverRoute): LatLng[] {
  const points: LatLng[] = [];

  if (route.vehicle) {
    points.push({
      latitude: route.vehicle.startLatitude,
      longitude: route.vehicle.startLongitude,
    });
  }

  for (const stop of [...route.stops].sort((a, b) => a.stopOrder - b.stopOrder)) {
    points.push({
      latitude: stop.delivery.latitude,
      longitude: stop.delivery.longitude,
    });
  }

  if (route.vehicle) {
    points.push({
      latitude: route.vehicle.endLatitude,
      longitude: route.vehicle.endLongitude,
    });
  }

  return points.length > 0
    ? points
    : [{ latitude: 58.1467, longitude: 7.9956 }];
}

function startSimulatedLocationUpdates(
  isActive: () => boolean,
  route: DriverRoute,
): () => void {
  const waypoints = buildSimulationWaypoints(route);
  let index = 0;

  const tick = async () => {
    if (!isActive()) return;
    const point = waypoints[index];
    index = Math.min(index + 1, waypoints.length - 1);
    try {
      await api.updateDriverLocation({
        latitude: point.latitude,
        longitude: point.longitude,
        heading: 90,
        speed: 12,
      });
      if (__DEV__) {
        console.log(
          `[RoutePilot] Simulated driver location ${index}/${waypoints.length - 1}:`,
          point.latitude.toFixed(5),
          point.longitude.toFixed(5),
        );
      }
    } catch {
      // ignore transient API errors
    }
  };

  void tick();
  const id = setInterval(() => void tick(), SIMULATE_INTERVAL_MS);
  return () => clearInterval(id);
}

export async function startDriverLocationUpdates(
  isActive: () => boolean,
  route?: DriverRoute | null,
): Promise<() => void> {
  if (simulateDriverLocation && route) {
    if (__DEV__) {
      console.log('[RoutePilot] Using simulated driver location along route');
    }
    return startSimulatedLocationUpdates(isActive, route);
  }

  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    return () => {};
  }

  const tick = async () => {
    if (!isActive()) return;
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      await api.updateDriverLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        heading: pos.coords.heading ?? undefined,
        speed: pos.coords.speed ?? undefined,
      });
    } catch {
      // ignore transient GPS/API errors
    }
  };

  void tick();
  const id = setInterval(() => void tick(), INTERVAL_MS);
  return () => clearInterval(id);
}

export function isDriverLocationSimulationEnabled(): boolean {
  return simulateDriverLocation;
}
