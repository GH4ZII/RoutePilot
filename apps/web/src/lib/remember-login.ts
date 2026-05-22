const CREDENTIALS_KEY = 'routepilot_remembered_login'
const REMEMBER_ME_KEY = 'routepilot_remember_me'

export type RememberedLogin = {
  organizationSlug: string
  email: string
}

export function getRememberMeEnabled(): boolean {
  return localStorage.getItem(REMEMBER_ME_KEY) === '1'
}

export function setRememberMeEnabled(enabled: boolean): void {
  if (enabled) {
    localStorage.setItem(REMEMBER_ME_KEY, '1')
  } else {
    localStorage.removeItem(REMEMBER_ME_KEY)
  }
}

export function getRememberedLogin(): RememberedLogin | null {
  const raw = localStorage.getItem(CREDENTIALS_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as RememberedLogin
    if (
      typeof parsed.organizationSlug === 'string' &&
      typeof parsed.email === 'string'
    ) {
      return parsed
    }
  } catch {
    // ignore invalid JSON
  }
  return null
}

export function setRememberedLogin(credentials: RememberedLogin): void {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
}

export function clearRememberedLogin(): void {
  localStorage.removeItem(CREDENTIALS_KEY)
}
