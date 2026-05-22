import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'routepilot_access_token';

let sessionToken: string | null = null;

export async function getStoredToken(): Promise<string | null> {
  if (sessionToken) {
    return sessionToken;
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setStoredToken(
  token: string,
  persistent: boolean,
): Promise<void> {
  if (persistent) {
    sessionToken = null;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    sessionToken = token;
  }
}

export async function clearStoredToken(): Promise<void> {
  sessionToken = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
