import { getStoredToken } from './auth-storage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'

export type SseEventType =
  | 'route.updated'
  | 'stop.updated'
  | 'driver.location'
  | 'optimization.completed'

export type SseMessage = {
  type: SseEventType
  data: Record<string, unknown>
  timestamp: string
}

export function subscribeToEvents(
  onMessage: (event: SseMessage) => void,
  onError?: () => void,
): () => void {
  const token = getStoredToken()
  if (!token) {
    return () => {}
  }

  const url = `${API_BASE_URL}/events/stream?token=${encodeURIComponent(token)}`
  const source = new EventSource(url)

  source.onmessage = (ev) => {
    try {
      onMessage(JSON.parse(ev.data) as SseMessage)
    } catch {
      // ignore malformed events
    }
  }

  source.onerror = () => {
    onError?.()
  }

  return () => source.close()
}
