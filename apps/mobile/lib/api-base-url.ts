import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** Metro / Expo dev host (same machine as the Nest API in local dev). */
function getDevLanHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.linkingUri ??
    null;

  if (!hostUri) {
    return null;
  }

  const withoutScheme = hostUri.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  const host = withoutScheme.split(':')[0]?.trim();

  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  return host;
}

/**
 * Resolves API base URL for Expo Go / simulators.
 * `localhost` in .env works in the browser and iOS Simulator, but physical
 * devices must reach the dev machine via LAN IP (from Metro's hostUri).
 */
export function resolveApiBaseUrl(): string {
  const configured = (
    process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '');

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    return configured;
  }

  const isLocalHost =
    url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  if (!isLocalHost) {
    return url.toString().replace(/\/$/, '');
  }

  const lanHost = getDevLanHost();
  if (lanHost) {
    url.hostname = lanHost;
    return url.toString().replace(/\/$/, '');
  }

  if (Platform.OS === 'android' && !Constants.isDevice) {
    url.hostname = '10.0.2.2';
    return url.toString().replace(/\/$/, '');
  }

  return configured;
}
