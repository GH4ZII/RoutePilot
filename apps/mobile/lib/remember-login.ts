import * as SecureStore from 'expo-secure-store';

const CREDENTIALS_KEY = 'routepilot_remembered_login';
const REMEMBER_ME_KEY = 'routepilot_remember_me';

export type RememberedLogin = {
  organizationSlug: string;
  email: string;
};

export async function getRememberMeEnabled(): Promise<boolean> {
  return (await SecureStore.getItemAsync(REMEMBER_ME_KEY)) === '1';
}

export async function setRememberMeEnabled(enabled: boolean): Promise<void> {
  if (enabled) {
    await SecureStore.setItemAsync(REMEMBER_ME_KEY, '1');
  } else {
    await SecureStore.deleteItemAsync(REMEMBER_ME_KEY);
  }
}

export async function getRememberedLogin(): Promise<RememberedLogin | null> {
  const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as RememberedLogin;
    if (
      typeof parsed.organizationSlug === 'string' &&
      typeof parsed.email === 'string'
    ) {
      return parsed;
    }
  } catch {
    // ignore invalid JSON
  }
  return null;
}

export async function setRememberedLogin(
  credentials: RememberedLogin,
): Promise<void> {
  await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials));
}

export async function clearRememberedLogin(): Promise<void> {
  await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
}
