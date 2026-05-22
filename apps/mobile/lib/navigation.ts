import { Alert, Linking, Platform } from 'react-native';

import type { DriverRoute } from '@/types/routes';

export type MapPoint = {
  latitude: number;
  longitude: number;
};

const MAX_WAYPOINTS = 23;

function formatCoord(latitude: number, longitude: number): string {
  return `${latitude},${longitude}`;
}

function coordsEqual(a: MapPoint, b: MapPoint): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < 1e-6 &&
    Math.abs(a.longitude - b.longitude) < 1e-6
  );
}

function dedupeAdjacent(points: MapPoint[]): MapPoint[] {
  return points.filter((point, index) => {
    if (index === 0) return true;
    return !coordsEqual(point, points[index - 1]);
  });
}

/** Depot → stopp i rekkefølge → depot (hvis ulikt start). */
export function getRouteMapPoints(route: DriverRoute): MapPoint[] {
  const stops = [...route.stops].sort((a, b) => a.stopOrder - b.stopOrder);
  const points: MapPoint[] = [];

  const vehicle = route.vehicle;
  if (vehicle) {
    points.push({
      latitude: vehicle.startLatitude,
      longitude: vehicle.startLongitude,
    });
  }

  for (const stop of stops) {
    points.push({
      latitude: stop.delivery.latitude,
      longitude: stop.delivery.longitude,
    });
  }

  if (vehicle) {
    const endDiffers =
      Math.abs(vehicle.startLatitude - vehicle.endLatitude) > 1e-6 ||
      Math.abs(vehicle.startLongitude - vehicle.endLongitude) > 1e-6;
    if (endDiffers) {
      points.push({
        latitude: vehicle.endLatitude,
        longitude: vehicle.endLongitude,
      });
    }
  }

  return dedupeAdjacent(points);
}

/** Apple Maps: saddr + daddr med +to: mellom mellomstopp. */
export function buildAppleMapsDirectionsUrl(points: MapPoint[]): string | null {
  if (points.length === 0) {
    return null;
  }

  if (points.length > MAX_WAYPOINTS + 2) {
    return null;
  }

  if (points.length === 1) {
    const p = points[0];
    return `http://maps.apple.com/?daddr=${encodeURIComponent(formatCoord(p.latitude, p.longitude))}&dirflg=d`;
  }

  const start = formatCoord(points[0].latitude, points[0].longitude);
  const destinations = points
    .slice(1)
    .map((p) => formatCoord(p.latitude, p.longitude))
    .join('+to:');

  // +to: må være uencodet mellom stopp (Apple Maps URL-syntaks).
  return `http://maps.apple.com/?saddr=${encodeURIComponent(start)}&daddr=${destinations}&dirflg=d`;
}

export function buildGoogleMapsDirectionsUrl(points: MapPoint[]): string | null {
  if (points.length === 0) {
    return null;
  }

  if (points.length === 1) {
    const p = points[0];
    return `https://www.google.com/maps/dir/?api=1&destination=${formatCoord(p.latitude, p.longitude)}&travelmode=driving`;
  }

  const origin = formatCoord(points[0].latitude, points[0].longitude);
  const last = points[points.length - 1];
  const destination = formatCoord(last.latitude, last.longitude);
  const middle = points.slice(1, -1);

  if (middle.length > MAX_WAYPOINTS) {
    return null;
  }

  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: 'driving',
  });

  if (middle.length > 0) {
    const waypoints = middle
      .map((p) => formatCoord(p.latitude, p.longitude))
      .join('|');
    params.set('waypoints', waypoints);
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function buildRouteDirectionsUrl(points: MapPoint[]): string | null {
  if (Platform.OS === 'ios') {
    return buildAppleMapsDirectionsUrl(points);
  }
  return buildGoogleMapsDirectionsUrl(points);
}

export function mapsAppLabel(): string {
  return Platform.OS === 'ios' ? 'Apple Maps' : 'Google Maps';
}

/** Åpne hele ruten i Apple Maps (iOS) eller Google Maps (Android). */
export async function openRouteInMaps(route: DriverRoute): Promise<void> {
  const points = getRouteMapPoints(route);
  if (points.length === 0) {
    Alert.alert('Navigasjon', 'Ruten har ingen stopp å vise.');
    return;
  }

  const url = buildRouteDirectionsUrl(points);
  const appName = mapsAppLabel();

  if (!url) {
    Alert.alert(
      'Navigasjon',
      `Ruten har for mange stopp (maks ${MAX_WAYPOINTS + 2} punkter i ${appName}).`,
    );
    return;
  }

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert('Navigasjon', `Kunne ikke åpne ${appName}.`);
    return;
  }

  await Linking.openURL(url);
}

/** Enkeltstopp. */
export async function openMapsNavigation(
  latitude: number,
  longitude: number,
): Promise<void> {
  const url = buildRouteDirectionsUrl([{ latitude, longitude }]);
  if (url) {
    await Linking.openURL(url);
  }
}
