import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteStatus, RouteStopStatus } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { ListRoutesQueryDto } from './dto/list-routes-query.dto';

export type RouteStopResponse = {
  id: string;
  stopOrder: number;
  estimatedArrival: Date | null;
  status: RouteStopStatus;
  delivery: {
    id: string;
    customerName: string;
    address: string;
    latitude: number;
    longitude: number;
    status: string;
    priority: string;
  };
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
  stops: RouteStopResponse[];
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class RoutesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
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
      include: {
        vehicle: true,
        stops: {
          orderBy: { stopOrder: 'asc' },
          include: { delivery: true },
        },
      },
      orderBy: [{ plannedDate: 'desc' }, { createdAt: 'desc' }],
    });

    return rows.map(toRouteResponse);
  }

  async findOne(user: JwtPayload, id: string): Promise<RouteResponse> {
    const row = await this.prisma.route.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
      include: {
        vehicle: true,
        stops: {
          orderBy: { stopOrder: 'asc' },
          include: { delivery: true },
        },
      },
    });

    if (!row) {
      throw new NotFoundException('Rute ikke funnet');
    }

    return toRouteResponse(row);
  }
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
  stops: Array<{
    id: string;
    stopOrder: number;
    estimatedArrival: Date | null;
    status: RouteStopStatus;
    delivery: {
      id: string;
      customerName: string;
      address: string;
      latitude: Parameters<typeof decimalToNumber>[0];
      longitude: Parameters<typeof decimalToNumber>[0];
      status: string;
      priority: string;
    };
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
    stops: route.stops.map((stop) => ({
      id: stop.id,
      stopOrder: stop.stopOrder,
      estimatedArrival: stop.estimatedArrival,
      status: stop.status,
      delivery: {
        id: stop.delivery.id,
        customerName: stop.delivery.customerName,
        address: stop.delivery.address,
        latitude: decimalToNumber(stop.delivery.latitude)!,
        longitude: decimalToNumber(stop.delivery.longitude)!,
        status: stop.delivery.status,
        priority: stop.delivery.priority,
      },
    })),
  };
}
