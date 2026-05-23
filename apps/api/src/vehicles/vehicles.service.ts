import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VehicleStatus } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { OrgScopeService } from '../common/org-scope.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

export type VehicleResponse = {
  id: string;
  organizationId: string;
  depotId: string | null;
  name: string;
  registrationNumber: string;
  startAddress: string;
  endAddress: string;
  maxWeightKg: number;
  maxVolumeM3: number;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class VehiclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
    private readonly geocoding: GeocodingService,
  ) {}

  async findAll(
    user: JwtPayload,
    query: ListVehiclesQueryDto,
  ): Promise<VehicleResponse[]> {
    const rows = await this.prisma.vehicle.findMany({
      where: this.orgScope.forOrganization(
        user,
        query.status ? { status: query.status } : {},
      ),
      orderBy: { name: 'asc' },
    });
    return rows.map(toVehicleResponse);
  }

  async findOne(user: JwtPayload, id: string): Promise<VehicleResponse> {
    const row = await this.findScopedOrThrow(user, id);
    return toVehicleResponse(row);
  }

  async create(
    user: JwtPayload,
    dto: CreateVehicleDto,
  ): Promise<VehicleResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);
    const registrationNumber = dto.registrationNumber.trim();
    const startAddress = dto.startAddress.trim();
    const endAddress = dto.endAddress.trim();

    const depotCoords = dto.depotId
      ? await this.resolveDepotCoords(user, dto.depotId)
      : null;

    const [start, end] = await Promise.all([
      depotCoords
        ? Promise.resolve(depotCoords)
        : this.geocoding.geocode(startAddress),
      this.geocoding.geocode(endAddress),
    ]);

    try {
      const created = await this.prisma.vehicle.create({
        data: {
          organizationId,
          depotId: dto.depotId,
          name: dto.name,
          registrationNumber,
          startAddress: depotCoords ? depotCoords.address : startAddress,
          endAddress,
          maxWeightKg: dto.maxWeightKg,
          maxVolumeM3: dto.maxVolumeM3,
          startLatitude: start.latitude,
          startLongitude: start.longitude,
          endLatitude: end.latitude,
          endLongitude: end.longitude,
          status: dto.status ?? VehicleStatus.AVAILABLE,
        },
      });
      return toVehicleResponse(created);
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Registration number already in use in this organization',
        );
      }
      throw error;
    }
  }

  async update(
    user: JwtPayload,
    id: string,
    dto: UpdateVehicleDto,
  ): Promise<VehicleResponse> {
    const existing = await this.findScopedOrThrow(user, id);

    const startAddress =
      dto.startAddress !== undefined
        ? dto.startAddress.trim()
        : existing.startAddress;
    const endAddress =
      dto.endAddress !== undefined
        ? dto.endAddress.trim()
        : existing.endAddress;

    let startLatitude = decimalToNumber(existing.startLatitude)!;
    let startLongitude = decimalToNumber(existing.startLongitude)!;
    let endLatitude = decimalToNumber(existing.endLatitude)!;
    let endLongitude = decimalToNumber(existing.endLongitude)!;

    if (dto.startAddress !== undefined) {
      const start = await this.geocoding.geocode(startAddress);
      startLatitude = start.latitude;
      startLongitude = start.longitude;
    }

    if (dto.endAddress !== undefined) {
      const end = await this.geocoding.geocode(endAddress);
      endLatitude = end.latitude;
      endLongitude = end.longitude;
    }

    if (dto.depotId) {
      const depotCoords = await this.resolveDepotCoords(user, dto.depotId);
      startLatitude = depotCoords.latitude;
      startLongitude = depotCoords.longitude;
    }

    try {
      const updated = await this.prisma.vehicle.update({
        where: { id },
        data: {
          ...(dto.depotId !== undefined && { depotId: dto.depotId }),
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.registrationNumber !== undefined && {
            registrationNumber: dto.registrationNumber.trim(),
          }),
          ...(dto.startAddress !== undefined && { startAddress }),
          ...(dto.endAddress !== undefined && { endAddress }),
          ...(dto.maxWeightKg !== undefined && {
            maxWeightKg: dto.maxWeightKg,
          }),
          ...(dto.maxVolumeM3 !== undefined && {
            maxVolumeM3: dto.maxVolumeM3,
          }),
          ...(dto.startAddress !== undefined && {
            startLatitude,
            startLongitude,
          }),
          ...(dto.endAddress !== undefined && {
            endLatitude,
            endLongitude,
          }),
          ...(dto.status !== undefined && { status: dto.status }),
        },
      });
      return toVehicleResponse(updated);
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Registration number already in use in this organization',
        );
      }
      throw error;
    }
  }

  async remove(user: JwtPayload, id: string): Promise<void> {
    await this.findScopedOrThrow(user, id);

    const assignedDrivers = await this.prisma.driver.count({
      where: { vehicleId: id },
    });
    if (assignedDrivers > 0) {
      throw new BadRequestException(
        'Cannot delete a vehicle assigned to drivers',
      );
    }

    const routes = await this.prisma.route.count({ where: { vehicleId: id } });
    if (routes > 0) {
      throw new BadRequestException('Cannot delete a vehicle used on routes');
    }

    await this.prisma.vehicle.delete({ where: { id } });
  }

  private async resolveDepotCoords(
    user: JwtPayload,
    depotId: string,
  ): Promise<{
    latitude: number;
    longitude: number;
    address: string;
  }> {
    const depot = await this.prisma.depot.findFirst({
      where: this.orgScope.forOrganization(user, { id: depotId }),
    });
    if (!depot) {
      throw new BadRequestException('Depot ikke funnet');
    }
    return {
      latitude: decimalToNumber(depot.latitude)!,
      longitude: decimalToNumber(depot.longitude)!,
      address: depot.address,
    };
  }

  private async findScopedOrThrow(user: JwtPayload, id: string) {
    const row = await this.prisma.vehicle.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
    });
    if (!row) {
      throw new NotFoundException('Vehicle not found');
    }
    return row;
  }
}

function toVehicleResponse(vehicle: {
  id: string;
  organizationId: string;
  depotId?: string | null;
  name: string;
  registrationNumber: string;
  startAddress: string;
  endAddress: string;
  maxWeightKg: Parameters<typeof decimalToNumber>[0];
  maxVolumeM3: Parameters<typeof decimalToNumber>[0];
  startLatitude: Parameters<typeof decimalToNumber>[0];
  startLongitude: Parameters<typeof decimalToNumber>[0];
  endLatitude: Parameters<typeof decimalToNumber>[0];
  endLongitude: Parameters<typeof decimalToNumber>[0];
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}): VehicleResponse {
  return {
    id: vehicle.id,
    organizationId: vehicle.organizationId,
    depotId: vehicle.depotId ?? null,
    name: vehicle.name,
    registrationNumber: vehicle.registrationNumber,
    startAddress: vehicle.startAddress,
    endAddress: vehicle.endAddress,
    maxWeightKg: decimalToNumber(vehicle.maxWeightKg)!,
    maxVolumeM3: decimalToNumber(vehicle.maxVolumeM3)!,
    startLatitude: decimalToNumber(vehicle.startLatitude)!,
    startLongitude: decimalToNumber(vehicle.startLongitude)!,
    endLatitude: decimalToNumber(vehicle.endLatitude)!,
    endLongitude: decimalToNumber(vehicle.endLongitude)!,
    status: vehicle.status,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002'
  );
}
