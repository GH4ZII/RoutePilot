export type SseEventType =
  | 'route.updated'
  | 'stop.updated'
  | 'driver.location'
  | 'optimization.completed';

export type SseEvent = {
  type: SseEventType;
  organizationId: string;
  data: Record<string, unknown>;
  timestamp: string;
};
