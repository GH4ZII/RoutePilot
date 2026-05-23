/** Haversine distance in meters between two WGS84 points. */
export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function assignDeliveriesToNearestDepot<
  T extends { id: string; latitude: number; longitude: number },
>(
  deliveries: T[],
  depots: Array<{
    depotKey: string;
    latitude: number;
    longitude: number;
  }>,
): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const depot of depots) {
    groups.set(depot.depotKey, []);
  }

  if (depots.length === 0) {
    groups.set('default', [...deliveries]);
    return groups;
  }

  for (const delivery of deliveries) {
    let bestKey = depots[0].depotKey;
    let bestDist = Infinity;
    for (const depot of depots) {
      const dist = haversineMeters(
        delivery.latitude,
        delivery.longitude,
        depot.latitude,
        depot.longitude,
      );
      if (dist < bestDist) {
        bestDist = dist;
        bestKey = depot.depotKey;
      }
    }
    groups.get(bestKey)!.push(delivery);
  }

  return groups;
}
