import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DeliveryStatus,
  DriverStatus,
  RouteEventType,
  RouteStatus,
  RouteStopStatus,
  UserRole,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { DriverScopeService } from '../common/driver-scope.service';
import { OrgScopeService } from '../common/org-scope.service';
import { EventsService } from '../events/events.service';
import { PrismaService } from '../prisma/prisma.service';
import { ListRoutesQueryDto } from './dto/list-routes-query.dto';

export type ProofOfDeliveryInRoute = {
  id: string;
  photoUrl: string | null;
  signatureUrl: string | null;
  note: string | null;
  latitude: number | null;
  longitude: number | null;
  capturedAt: Date;
};

export type RouteStopResponse = {
  id: string;
  stopOrder: number;
  estimatedArrival: Date | null;
  actualArrival: Date | null;
  status: RouteStopStatus;
  delivery: {
    id: string;
    customerName: string;
    phone: string | null;
    address: string;
    latitude: number;
    longitude: number;
    weightKg: number;
    volumeM3: number | null;
    notes: string | null;
    status: string;
    priority: string;
  };
  proofOfDelivery: ProofOfDeliveryInRoute | null;
};

export type RouteResponse = {
  id: string;
  organizationId: string;
  driverId: string | null;
  vehicleId: string | null;
  status: RouteStatus;
  plannedDate: Date;
  totalDistanceMeters: number | null;
  totalDurationSeconds: number | null;
  actualDistanceMeters: number | null;
  actualDurationSeconds: number | null;
  capacityUsedKg: number | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  vehicle: {
    id: string;
    name: string;
    startAddress: string;
    endAddress: string;
    startLatitude: number;
    startLongitude: number;
    endLatitude: number;
    endLongitude: number;
  } | null;
  driver: {
    id: string;
    name: string;
    phone: string | null;
  } | null;
  stops: RouteStopResponse[];
  createdAt: Date;
  updatedAt: Date;
};

const routeInclude = {
  vehicle: true,
  driver: true,
  stops: {
    orderBy: { stopOrder: 'asc' as const },
    include: { delivery: true, proofOfDelivery: true },
  },
};

@Injectable()
export class RoutesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
    private readonly driverScope: DriverScopeService,
    private readonly events: EventsService,
  ) {}

  async findAll(
    user: JwtPayload,
    query: ListRoutesQueryDto,
  ): Promise<RouteResponse[]> {
    const rows = await this.prisma.route.findMany({
      where: this.orgScope.forOrganization(
        user,
        query.status ? { status: query.status } : {},
      ),
      include: routeInclude,
      orderBy: [{ plannedDate: 'desc' }, { createdAt: 'desc' }],
    });

    return rows.map(toRouteResponse);
  }

  async findOne(user: JwtPayload, id: string): Promise<RouteResponse> {
    const row = await this.findScopedOrThrow(user, id);
    if (user.role === UserRole.DRIVER) {
      const driver = await this.driverScope.requireDriverForUser(user);
      if (row.driverId !== driver.id) {
        throw new ForbiddenException('Du har ikke tilgang til denne ruten');
      }
    }
    return toRouteResponse(row);
  }

  /** Dagens og fremtidige ruter for innlogget sjåfør. */
  async findMyRoutes(user: JwtPayload): Promise<RouteResponse[]> {
    const driver = await this.driverScope.requireDriverForUser(user);
    const today = todayUtcDate();

    const rows = await this.prisma.route.findMany({
      where: {
        organizationId: user.organizationId,
        driverId: driver.id,
        OR: [
          { status: RouteStatus.IN_PROGRESS },
          {
            plannedDate: { gte: today },
            status: {
              in: [RouteStatus.PLANNED, RouteStatus.ASSIGNED],
            },
          },
        ],
      },
      include: routeInclude,
    });

    rows.sort((a, b) => {
      if (a.status === RouteStatus.IN_PROGRESS && b.status !== RouteStatus.IN_PROGRESS) {
        return -1;
      }
      if (b.status === RouteStatus.IN_PROGRESS && a.status !== RouteStatus.IN_PROGRESS) {
        return 1;
      }
      const dateDiff = a.plannedDate.getTime() - b.plannedDate.getTime();
      if (dateDiff !== 0) {
        return dateDiff;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return rows.map(toRouteResponse);
  }

  /** Bakoverkompatibel — første rute fra {@link findMyRoutes}. */
  async findMyToday(user: JwtPayload): Promise<RouteResponse | null> {
    const routes = await this.findMyRoutes(user);
    return routes[0] ?? null;
  }

  async assign(
    user: JwtPayload,
    id: string,
    driverId: string,
  ): Promise<RouteResponse> {
    this.assertStaff(user);

    const route = await this.findScopedOrThrow(user, id);
    const driver = await this.prisma.driver.findFirst({
      where: this.orgScope.forOrganization(user, { id: driverId }),
    });
    if (!driver) {
      throw new NotFoundException('Sjåfør ikke funnet');
    }

    if (route.status === RouteStatus.IN_PROGRESS) {
      return this.assignDriverWhileInProgress(user, route, driverId, driver);
    }

    if (
      route.status !== RouteStatus.PLANNED &&
      route.status !== RouteStatus.ASSIGNED
    ) {
      throw new BadRequestException(
        'Ruten kan kun tildeles når status er PLANNED eller ASSIGNED',
      );
    }

    const isSameDriver = route.driverId === driverId;
    if (
      driver.status !== DriverStatus.AVAILABLE &&
      !isSameDriver
    ) {
      throw new BadRequestException('Sjåføren må være AVAILABLE for tildeling');
    }

    if (isSameDriver && route.status === RouteStatus.ASSIGNED) {
      return toRouteResponse(route);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (route.driverId && route.driverId !== driverId) {
        await tx.driver.updateMany({
          where: { activeRouteId: route.id },
          data: { activeRouteId: null },
        });
      }

      return tx.route.update({
        where: { id: route.id },
        data: {
          driverId,
          status: RouteStatus.ASSIGNED,
        },
        include: routeInclude,
      });
    });

    return toRouteResponse(updated);
  }

  private async assignDriverWhileInProgress(
    user: JwtPayload,
    route: Awaited<ReturnType<typeof this.findScopedOrThrow>>,
    driverId: string,
    newDriver: { id: string; status: DriverStatus },
  ): Promise<RouteResponse> {
    if (!route.driverId) {
      throw new BadRequestException(
        'Ruten må ha tildelt sjåfør før bytte under kjøring',
      );
    }

    if (route.driverId === driverId) {
      return toRouteResponse(route);
    }

    if (newDriver.status !== DriverStatus.AVAILABLE) {
      throw new BadRequestException(
        'Ny sjåfør må være tilgjengelig for å ta over ruten',
      );
    }

    const previousDriverId = route.driverId;

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.driver.update({
        where: { id: previousDriverId },
        data: {
          activeRouteId: null,
          status: DriverStatus.AVAILABLE,
        },
      });

      await tx.driver.update({
        where: { id: driverId },
        data: {
          activeRouteId: route.id,
          status: DriverStatus.ON_ROUTE,
        },
      });

      return tx.route.update({
        where: { id: route.id },
        data: { driverId },
        include: routeInclude,
      });
    });

    this.events.publish(user.organizationId, 'route.updated', {
      routeId: route.id,
      status: RouteStatus.IN_PROGRESS,
      driverId,
    });

    return toRouteResponse(updated);
  }

  async start(user: JwtPayload, id: string): Promise<RouteResponse> {
    const route = await this.findScopedOrThrow(user, id);
    await this.assertDriverCanOperate(user, route);

    if (
      route.status !== RouteStatus.ASSIGNED &&
      route.status !== RouteStatus.PLANNED
    ) {
      throw new BadRequestException(
        'Ruten kan startes fra status PLANNED eller ASSIGNED',
      );
    }

    const driverId = route.driverId;
    if (!driverId) {
      throw new BadRequestException('Ruten må ha tildelt sjåfør før start');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.driver.update({
        where: { id: driverId },
        data: {
          status: DriverStatus.ON_ROUTE,
          activeRouteId: route.id,
        },
      });

      const next = await tx.route.update({
        where: { id: route.id },
        data: {
          status: RouteStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
        include: routeInclude,
      });

      await tx.routeEvent.create({
        data: {
          routeId: route.id,
          type: RouteEventType.ROUTE_STARTED,
        },
      });

      return next;
    });

    this.events.publish(user.organizationId, 'route.updated', {
      routeId: route.id,
      status: RouteStatus.IN_PROGRESS,
    });

    return toRouteResponse(updated);
  }

  async finish(user: JwtPayload, id: string): Promise<RouteResponse> {
    const route = await this.findScopedOrThrow(user, id);
    await this.assertDriverCanOperate(user, route);

    if (route.status !== RouteStatus.IN_PROGRESS) {
      throw new BadRequestException('Ruten må være IN_PROGRESS for å fullføres');
    }

    const pendingStops = route.stops.filter(
      (s) =>
        s.status === RouteStopStatus.PENDING ||
        s.status === RouteStopStatus.IN_PROGRESS,
    );
    if (pendingStops.length > 0) {
      throw new BadRequestException(
        'Alle stopp må være fullført eller markert som feilet før ruten avsluttes',
      );
    }

    const driverId = route.driverId;
    const finishedAt = new Date();
    const actualDurationSeconds =
      route.startedAt != null
        ? Math.round(
            (finishedAt.getTime() - route.startedAt.getTime()) / 1000,
          )
        : null;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (driverId) {
        await tx.driver.update({
          where: { id: driverId },
          data: {
            status: DriverStatus.AVAILABLE,
            activeRouteId: null,
          },
        });
      }

      const next = await tx.route.update({
        where: { id: route.id },
        data: {
          status: RouteStatus.COMPLETED,
          finishedAt,
          actualDurationSeconds,
          actualDistanceMeters: route.totalDistanceMeters,
        },
        include: routeInclude,
      });

      await tx.routeEvent.create({
        data: {
          routeId: route.id,
          type: RouteEventType.ROUTE_FINISHED,
        },
      });

      return next;
    });

    this.events.publish(user.organizationId, 'route.updated', {
      routeId: route.id,
      status: RouteStatus.COMPLETED,
    });

    return toRouteResponse(updated);
  }

  async remove(user: JwtPayload, id: string): Promise<void> {
    const route = await this.findScopedOrThrow(user, id);

    await this.prisma.$transaction(async (tx) => {
      for (const stop of route.stops) {
        if (stop.delivery.status === DeliveryStatus.DELIVERED) {
          continue;
        }

        const otherStops = await tx.routeStop.count({
          where: {
            deliveryId: stop.delivery.id,
            routeId: { not: route.id },
          },
        });

        if (otherStops === 0) {
          await tx.delivery.update({
            where: { id: stop.delivery.id },
            data: { status: DeliveryStatus.PENDING },
          });
        }
      }

      await tx.driver.updateMany({
        where: { activeRouteId: route.id },
        data: {
          activeRouteId: null,
          status: DriverStatus.AVAILABLE,
        },
      });

      await tx.route.delete({ where: { id: route.id } });
    });

    this.events.publish(user.organizationId, 'route.updated', {
      routeId: route.id,
      deleted: true,
    });
  }

  async findStopScoped(user: JwtPayload, stopId: string) {
    const stop = await this.prisma.routeStop.findFirst({
      where: {
        id: stopId,
        route: this.orgScope.forOrganization(user),
      },
      include: {
        delivery: true,
        route: { include: routeInclude },
      },
    });
    if (!stop) {
      throw new NotFoundException('Rutestopp ikke funnet');
    }
    return stop;
  }

  private assertStaff(user: JwtPayload) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.DISPATCHER
    ) {
      throw new ForbiddenException();
    }
  }

  private async assertDriverCanOperate(
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
      throw new ForbiddenException('Du har ikke tilgang til denne ruten');
    }
  }

  private async findScopedOrThrow(user: JwtPayload, id: string) {
    const row = await this.prisma.route.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
      include: routeInclude,
    });
    if (!row) {
      throw new NotFoundException('Rute ikke funnet');
    }
    return row;
  }
}

function todayUtcDate(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function toRouteResponse(route: {
  id: string;
  organizationId: string;
  driverId: string | null;
  vehicleId: string | null;
  status: RouteStatus;
  plannedDate: Date;
  totalDistanceMeters: number | null;
  totalDurationSeconds: number | null;
  actualDistanceMeters: number | null;
  actualDurationSeconds: number | null;
  capacityUsedKg: Parameters<typeof decimalToNumber>[0] | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  vehicle: {
    id: string;
    name: string;
    startAddress: string;
    endAddress: string;
    startLatitude: Parameters<typeof decimalToNumber>[0];
    startLongitude: Parameters<typeof decimalToNumber>[0];
    endLatitude: Parameters<typeof decimalToNumber>[0];
    endLongitude: Parameters<typeof decimalToNumber>[0];
  } | null;
  driver: { id: string; name: string; phone: string | null } | null;
  stops: Array<{
    id: string;
    stopOrder: number;
    estimatedArrival: Date | null;
    actualArrival: Date | null;
    status: RouteStopStatus;
    delivery: {
      id: string;
      customerName: string;
      phone: string | null;
      address: string;
      latitude: Parameters<typeof decimalToNumber>[0];
      longitude: Parameters<typeof decimalToNumber>[0];
      weightKg: Parameters<typeof decimalToNumber>[0];
      volumeM3: Parameters<typeof decimalToNumber>[0] | null;
      notes: string | null;
      status: string;
      priority: string;
    };
    proofOfDelivery: {
      id: string;
      photoUrl: string | null;
      signatureUrl: string | null;
      note: string | null;
      latitude: Parameters<typeof decimalToNumber>[0] | null;
      longitude: Parameters<typeof decimalToNumber>[0] | null;
      capturedAt: Date;
    } | null;
  }>;
}): RouteResponse {
  return {
    id: route.id,
    organizationId: route.organizationId,
    driverId: route.driverId,
    vehicleId: route.vehicleId,
    status: route.status,
    plannedDate: route.plannedDate,
    totalDistanceMeters: route.totalDistanceMeters,
    totalDurationSeconds: route.totalDurationSeconds,
    actualDistanceMeters: route.actualDistanceMeters,
    actualDurationSeconds: route.actualDurationSeconds,
    capacityUsedKg:
      route.capacityUsedKg != null
        ? decimalToNumber(route.capacityUsedKg)
        : null,
    startedAt: route.startedAt,
    finishedAt: route.finishedAt,
    createdAt: route.createdAt,
    updatedAt: route.updatedAt,
    vehicle: route.vehicle
      ? {
          id: route.vehicle.id,
          name: route.vehicle.name,
          startAddress: route.vehicle.startAddress,
          endAddress: route.vehicle.endAddress,
          startLatitude: decimalToNumber(route.vehicle.startLatitude)!,
          startLongitude: decimalToNumber(route.vehicle.startLongitude)!,
          endLatitude: decimalToNumber(route.vehicle.endLatitude)!,
          endLongitude: decimalToNumber(route.vehicle.endLongitude)!,
        }
      : null,
    driver: route.driver
      ? {
          id: route.driver.id,
          name: route.driver.name,
          phone: route.driver.phone,
        }
      : null,
    stops: route.stops.map((stop) => ({
      id: stop.id,
      stopOrder: stop.stopOrder,
      estimatedArrival: stop.estimatedArrival,
      actualArrival: stop.actualArrival,
      status: stop.status,
      delivery: {
        id: stop.delivery.id,
        customerName: stop.delivery.customerName,
        phone: stop.delivery.phone,
        address: stop.delivery.address,
        latitude: decimalToNumber(stop.delivery.latitude)!,
        longitude: decimalToNumber(stop.delivery.longitude)!,
        weightKg: decimalToNumber(stop.delivery.weightKg)!,
        volumeM3:
          stop.delivery.volumeM3 != null
            ? decimalToNumber(stop.delivery.volumeM3)
            : null,
        notes: stop.delivery.notes,
        status: stop.delivery.status,
        priority: stop.delivery.priority,
      },
      proofOfDelivery: stop.proofOfDelivery
        ? {
            id: stop.proofOfDelivery.id,
            photoUrl: stop.proofOfDelivery.photoUrl,
            signatureUrl: stop.proofOfDelivery.signatureUrl,
            note: stop.proofOfDelivery.note,
            latitude:
              stop.proofOfDelivery.latitude != null
                ? decimalToNumber(stop.proofOfDelivery.latitude)
                : null,
            longitude:
              stop.proofOfDelivery.longitude != null
                ? decimalToNumber(stop.proofOfDelivery.longitude)
                : null,
            capturedAt: stop.proofOfDelivery.capturedAt,
          }
        : null,
    })),
  };
}
