import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DriverStatus } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { ListDriversQueryDto } from './dto/list-drivers-query.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

export type DriverResponse = {
  id: string;
  organizationId: string;
  userId: string | null;
  vehicleId: string | null;
  activeRouteId: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  status: DriverStatus;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class DriversService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
  ) {}

  async findAll(
    user: JwtPayload,
    query: ListDriversQueryDto,
  ): Promise<DriverResponse[]> {
    const rows = await this.prisma.driver.findMany({
      where: this.orgScope.forOrganization(
        user,
        query.status ? { status: query.status } : {},
      ),
      orderBy: { name: 'asc' },
    });
    return rows.map(toDriverResponse);
  }

  async findOne(user: JwtPayload, id: string): Promise<DriverResponse> {
    const row = await this.findScopedOrThrow(user, id);
    return toDriverResponse(row);
  }

  async create(user: JwtPayload, dto: CreateDriverDto): Promise<DriverResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);
    await this.assertUserInOrg(user, dto.userId);
    await this.assertVehicleInOrg(user, dto.vehicleId);

    const created = await this.prisma.driver.create({
      data: {
        organizationId,
        name: dto.name,
        phone: dto.phone,
        email: dto.email?.toLowerCase(),
        status: dto.status ?? DriverStatus.AVAILABLE,
        userId: dto.userId,
        vehicleId: dto.vehicleId,
      },
    });
    return toDriverResponse(created);
  }

  async update(
    user: JwtPayload,
    id: string,
    dto: UpdateDriverDto,
  ): Promise<DriverResponse> {
    await this.findScopedOrThrow(user, id);
    await this.assertUserInOrg(user, dto.userId ?? undefined, id);
    await this.assertVehicleInOrg(user, dto.vehicleId ?? undefined);

    const updated = await this.prisma.driver.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.email !== undefined && {
          email: dto.email ? dto.email.toLowerCase() : null,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.userId !== undefined && { userId: dto.userId }),
        ...(dto.vehicleId !== undefined && { vehicleId: dto.vehicleId }),
      },
    });
    return toDriverResponse(updated);
  }

  async remove(user: JwtPayload, id: string): Promise<void> {
    const driver = await this.findScopedOrThrow(user, id);
    if (driver.activeRouteId) {
      throw new BadRequestException(
        'Cannot delete a driver with an active route',
      );
    }
    await this.prisma.driver.delete({ where: { id } });
  }

  private async findScopedOrThrow(user: JwtPayload, id: string) {
    const row = await this.prisma.driver.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
    });
    if (!row) {
      throw new NotFoundException('Driver not found');
    }
    return row;
  }

  private async assertUserInOrg(
    user: JwtPayload,
    userId?: string,
    excludeDriverId?: string,
  ) {
    if (!userId) return;
    const found = await this.prisma.user.findFirst({
      where: this.orgScope.forOrganization(user, { id: userId }),
    });
    if (!found) {
      throw new BadRequestException('User not found in this organization');
    }
    const linked = await this.prisma.driver.findUnique({ where: { userId } });
    if (linked && linked.id !== excludeDriverId) {
      throw new BadRequestException('User is already linked to a driver');
    }
  }

  private async assertVehicleInOrg(user: JwtPayload, vehicleId?: string) {
    if (!vehicleId) return;
    const found = await this.prisma.vehicle.findFirst({
      where: this.orgScope.forOrganization(user, { id: vehicleId }),
    });
    if (!found) {
      throw new BadRequestException('Vehicle not found in this organization');
    }
  }
}

function toDriverResponse(driver: {
  id: string;
  organizationId: string;
  userId: string | null;
  vehicleId: string | null;
  activeRouteId: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  status: DriverStatus;
  createdAt: Date;
  updatedAt: Date;
}): DriverResponse {
  return { ...driver };
}
