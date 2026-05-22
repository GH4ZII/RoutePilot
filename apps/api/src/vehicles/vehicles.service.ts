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
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

export type VehicleResponse = {
  id: string;
  organizationId: string;
  name: string;
  registrationNumber: string;
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

    try {
      const created = await this.prisma.vehicle.create({
        data: {
          organizationId,
          name: dto.name,
          registrationNumber,
          maxWeightKg: dto.maxWeightKg,
          maxVolumeM3: dto.maxVolumeM3,
          startLatitude: dto.startLatitude,
          startLongitude: dto.startLongitude,
          endLatitude: dto.endLatitude,
          endLongitude: dto.endLongitude,
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
    await this.findScopedOrThrow(user, id);

    try {
      const updated = await this.prisma.vehicle.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.registrationNumber !== undefined && {
            registrationNumber: dto.registrationNumber.trim(),
          }),
          ...(dto.maxWeightKg !== undefined && {
            maxWeightKg: dto.maxWeightKg,
          }),
          ...(dto.maxVolumeM3 !== undefined && {
            maxVolumeM3: dto.maxVolumeM3,
          }),
          ...(dto.startLatitude !== undefined && {
            startLatitude: dto.startLatitude,
          }),
          ...(dto.startLongitude !== undefined && {
            startLongitude: dto.startLongitude,
          }),
          ...(dto.endLatitude !== undefined && {
            endLatitude: dto.endLatitude,
          }),
          ...(dto.endLongitude !== undefined && {
            endLongitude: dto.endLongitude,
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
  name: string;
  registrationNumber: string;
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
    name: vehicle.name,
    registrationNumber: vehicle.registrationNumber,
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
