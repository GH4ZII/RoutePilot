import { resolveApiBaseUrl } from '@/lib/api-base-url';
import { getStoredToken } from '@/lib/auth-storage';

export type SseMessage = {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
};

export function subscribeToEvents(
  onMessage: (event: SseMessage) => void,
): () => void {
  let closed = false;
  let source: EventSource | null = null;

  void (async () => {
    const token = await getStoredToken();
    if (!token || closed) return;
    const url = `${resolveApiBaseUrl()}/events/stream?token=${encodeURIComponent(token)}`;
    source = new EventSource(url);
    source.onmessage = (ev) => {
      try {
        onMessage(JSON.parse(ev.data) as SseMessage);
      } catch {
        // ignore
      }
    };
  })();

  return () => {
    closed = true;
    source?.close();
  };
}
