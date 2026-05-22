import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  DeliveryStatus,
  RouteEventType,
  RouteStatus,
  RouteStopStatus,
  UserRole,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { DriverScopeService } from '../common/driver-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RouteResponse } from '../routes/routes.service';
import { RoutesService } from '../routes/routes.service';
import { FailRouteStopDto } from './dto/fail-route-stop.dto';
import { ProofOfDeliveryDto } from './dto/proof-of-delivery.dto';

@Injectable()
export class RouteStopsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly routes: RoutesService,
    private readonly driverScope: DriverScopeService,
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

    return this.routes.findOne(user, stop.routeId);
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

    await this.prisma.proofOfDelivery.create({
      data: {
        routeStopId: stop.id,
        note: dto.note,
        photoUrl: dto.photoUrl,
        latitude: dto.latitude,
        longitude: dto.longitude,
        capturedAt: new Date(),
      },
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
