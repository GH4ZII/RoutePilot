import { Linking, Platform } from 'react-native';

export async function openMapsNavigation(
  latitude: number,
  longitude: number,
  label?: string,
): Promise<void> {
  const destination = `${latitude},${longitude}`;
  const encodedLabel = label ? encodeURIComponent(label) : undefined;

  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}${
    encodedLabel ? `&destination_place_id=${encodedLabel}` : ''
  }`;

  const appleUrl = `http://maps.apple.com/?daddr=${destination}${
    encodedLabel ? `&q=${encodedLabel}` : ''
  }`;

  const url = Platform.OS === 'ios' ? appleUrl : googleUrl;
  const canOpen = await Linking.canOpenURL(url);
  await Linking.openURL(canOpen ? url : googleUrl);
}
