import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import type { SseEvent, SseEventType } from './events.types';

@Injectable()
export class EventsService {
  private readonly bus = new Subject<SseEvent>();

  publish(
    organizationId: string,
    type: SseEventType,
    data: Record<string, unknown>,
  ): void {
    this.bus.next({
      type,
      organizationId,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  stream(organizationId: string): Observable<MessageEvent> {
    return this.bus.pipe(
      filter((event) => event.organizationId === organizationId),
      map(
        (event) =>
          ({
            data: JSON.stringify({
              type: event.type,
              data: event.data,
              timestamp: event.timestamp,
            }),
          }) as MessageEvent,
      ),
    );
  }
}
