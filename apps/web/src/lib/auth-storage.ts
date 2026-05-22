const TOKEN_KEY = 'routepilot_access_token'

function getTokenStorage(persistent: boolean): Storage {
  return persistent ? localStorage : sessionStorage
}

export function getStoredToken(): string | null {
  return (
    localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
  )
}

export function setStoredToken(token: string, persistent: boolean): void {
  const storage = getTokenStorage(persistent)
  const other = getTokenStorage(!persistent)
  storage.setItem(TOKEN_KEY, token)
  other.removeItem(TOKEN_KEY)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}
