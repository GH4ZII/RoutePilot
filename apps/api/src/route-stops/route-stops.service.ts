import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DeliveryStatus,
  NotificationType,
  RouteEventType,
  RouteStatus,
  RouteStopStatus,
  UserRole,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { DriverScopeService } from '../common/driver-scope.service';
import { EventsService } from '../events/events.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RouteResponse } from '../routes/routes.service';
import { RoutesService } from '../routes/routes.service';
import { FailRouteStopDto } from './dto/fail-route-stop.dto';
import { ProofOfDeliveryDto } from './dto/proof-of-delivery.dto';

export type ProofOfDeliveryResponse = {
  id: string;
  routeStopId: string;
  photoUrl: string | null;
  signatureUrl: string | null;
  note: string | null;
  latitude: number | null;
  longitude: number | null;
  capturedAt: Date;
};

@Injectable()
export class RouteStopsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly routes: RoutesService,
    private readonly driverScope: DriverScopeService,
    private readonly events: EventsService,
    private readonly notifications: NotificationsService,
  ) {}

  async complete(user: JwtPayload, stopId: string): Promise<RouteResponse> {
    const stop = await this.routes.findStopScoped(user, stopId);
    await this.assertCanEditStop(user, stop.route);

    if (stop.route.status !== RouteStatus.IN_PROGRESS) {
      throw new BadRequestException('Ruten må være startet');
    }
    if (stop.status !== RouteStopStatus.PENDING) {
      throw new BadRequestException('Stoppet er allerede behandlet');
    }

    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.routeStop.update({
        where: { id: stop.id },
        data: {
          status: RouteStopStatus.COMPLETED,
          actualArrival: now,
        },
      });
      await tx.delivery.update({
        where: { id: stop.deliveryId },
        data: { status: DeliveryStatus.DELIVERED },
      });
      await tx.routeEvent.create({
        data: {
          routeId: stop.routeId,
          type: RouteEventType.STOP_COMPLETED,
          metadata: { routeStopId: stop.id, deliveryId: stop.deliveryId },
        },
      });
    });

    await this.notifications.enqueueForStop(
      user.organizationId,
      stop.deliveryId,
      NotificationType.DELIVERED,
      { routeStopId: stop.id },
    );

    this.events.publish(user.organizationId, 'stop.updated', {
      routeId: stop.routeId,
      stopId: stop.id,
      status: RouteStopStatus.COMPLETED,
    });

    return this.routes.findOne(user, stop.routeId);
  }

  async fail(
    user: JwtPayload,
    stopId: string,
    dto: FailRouteStopDto,
  ): Promise<RouteResponse> {
    const stop = await this.routes.findStopScoped(user, stopId);
    await this.assertCanEditStop(user, stop.route);

    if (stop.route.status !== RouteStatus.IN_PROGRESS) {
      throw new BadRequestException('Ruten må være startet');
    }
    if (stop.status !== RouteStopStatus.PENDING) {
      throw new BadRequestException('Stoppet er allerede behandlet');
    }

    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.routeStop.update({
        where: { id: stop.id },
        data: {
          status: RouteStopStatus.FAILED,
          actualArrival: now,
        },
      });
      await tx.delivery.update({
        where: { id: stop.deliveryId },
        data: { status: DeliveryStatus.FAILED },
      });
      await tx.routeEvent.create({
        data: {
          routeId: stop.routeId,
          type: RouteEventType.STOP_FAILED,
          metadata: {
            routeStopId: stop.id,
            deliveryId: stop.deliveryId,
            reason: dto.reason ?? null,
          },
        },
      });
    });

    await this.notifications.enqueueForStop(
      user.organizationId,
      stop.deliveryId,
      NotificationType.FAILED,
      { routeStopId: stop.id, reason: dto.reason ?? null },
    );

    this.events.publish(user.organizationId, 'stop.updated', {
      routeId: stop.routeId,
      stopId: stop.id,
      status: RouteStopStatus.FAILED,
    });

    return this.routes.findOne(user, stop.routeId);
  }

  async getProof(
    user: JwtPayload,
    stopId: string,
  ): Promise<ProofOfDeliveryResponse> {
    const stop = await this.routes.findStopScoped(user, stopId);
    const proof = await this.prisma.proofOfDelivery.findUnique({
      where: { routeStopId: stop.id },
    });
    if (!proof) {
      throw new NotFoundException('Leveringsbevis ikke funnet');
    }
    return toProofResponse(proof);
  }

  async submitProof(
    user: JwtPayload,
    stopId: string,
    dto: ProofOfDeliveryDto,
  ): Promise<RouteResponse> {
    const stop = await this.routes.findStopScoped(user, stopId);
    await this.assertCanEditStop(user, stop.route);

    if (stop.status !== RouteStopStatus.COMPLETED) {
      throw new BadRequestException(
        'Leveringsbevis kan kun registreres etter at stoppet er fullført',
      );
    }

    const existing = await this.prisma.proofOfDelivery.findUnique({
      where: { routeStopId: stop.id },
    });
    if (existing) {
      throw new BadRequestException('Leveringsbevis er allerede registrert');
    }

    const capturedAt = resolveCapturedAt(dto.capturedAt);

    await this.prisma.proofOfDelivery.create({
      data: {
        routeStopId: stop.id,
        note: dto.note,
        photoUrl: dto.photoUrl,
        signatureUrl: dto.signatureUrl,
        latitude: dto.latitude,
        longitude: dto.longitude,
        capturedAt,
      },
    });

    this.events.publish(user.organizationId, 'stop.updated', {
      routeId: stop.routeId,
      stopId: stop.id,
      proofSubmitted: true,
    });

    return this.routes.findOne(user, stop.routeId);
  }

  private async assertCanEditStop(
    user: JwtPayload,
    route: { driverId: string | null; status: RouteStatus },
  ) {
    if (user.role === UserRole.ADMIN || user.role === UserRole.DISPATCHER) {
      return;
    }
    if (user.role !== UserRole.DRIVER) {
      throw new ForbiddenException();
    }
    const driver = await this.driverScope.requireDriverForUser(user);
    if (route.driverId !== driver.id) {
      throw new ForbiddenException('Du har ikke tilgang til dette stoppet');
    }
  }
}

function resolveCapturedAt(value?: string): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestException('Ugyldig capturedAt');
  }
  const now = Date.now();
  const diff = Math.abs(now - parsed.getTime());
  if (diff > 5 * 60 * 1000) {
    throw new BadRequestException(
      'capturedAt må være innen 5 minutter fra nå',
    );
  }
  return parsed;
}

function toProofResponse(proof: {
  id: string;
  routeStopId: string;
  photoUrl: string | null;
  signatureUrl: string | null;
  note: string | null;
  latitude: Parameters<typeof decimalToNumber>[0] | null;
  longitude: Parameters<typeof decimalToNumber>[0] | null;
  capturedAt: Date;
}): ProofOfDeliveryResponse {
  return {
    id: proof.id,
    routeStopId: proof.routeStopId,
    photoUrl: proof.photoUrl,
    signatureUrl: proof.signatureUrl,
    note: proof.note,
    latitude:
      proof.latitude != null ? decimalToNumber(proof.latitude) : null,
    longitude:
      proof.longitude != null ? decimalToNumber(proof.longitude) : null,
    capturedAt: proof.capturedAt,
  };
}
