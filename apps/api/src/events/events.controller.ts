import {
  Controller,
  ForbiddenException,
  MessageEvent,
  Query,
  Sse,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserRole } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly events: EventsService,
    private readonly jwt: JwtService,
  ) {}

  @Sse('stream')
  stream(@Query('token') token?: string): Observable<MessageEvent> {
    const payload = this.resolvePayload(token);
    const allowed: UserRole[] = [
      UserRole.ADMIN,
      UserRole.DISPATCHER,
      UserRole.DRIVER,
    ];
    if (!allowed.includes(payload.role)) {
      throw new ForbiddenException();
    }
    return this.events.stream(payload.organizationId);
  }

  private resolvePayload(token?: string): JwtPayload {
    if (!token?.trim()) {
      throw new UnauthorizedException('SSE krever token query parameter');
    }
    try {
      return this.jwt.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Ugyldig token');
    }
  }
}
