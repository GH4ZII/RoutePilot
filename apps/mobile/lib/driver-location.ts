import * as Location from 'expo-location';
import * as api from '@/lib/api';

const INTERVAL_MS = 30_000;

export async function startDriverLocationUpdates(
  isActive: () => boolean,
): Promise<() => void> {
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
