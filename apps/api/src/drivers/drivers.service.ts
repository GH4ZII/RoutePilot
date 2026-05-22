import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DriverStatus, UserRole } from '../generated/prisma/client';
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
    await this.assertVehicleInOrg(user, dto.vehicleId);

    if (dto.userId) {
      await this.assertUserInOrg(user, dto.userId);
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

    if (!dto.email || !dto.password) {
      throw new BadRequestException(
        'E-post og passord er påkrevd for å opprette sjåfør med innlogging',
      );
    }

    const email = dto.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { organizationId_email: { organizationId, email } },
    });
    if (existingUser) {
      throw new ConflictException(
        'E-posten er allerede i bruk i denne organisasjonen',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const created = await this.prisma.$transaction(async (tx) => {
      const userRecord = await tx.user.create({
        data: {
          organizationId,
          email,
          passwordHash,
          role: UserRole.DRIVER,
          name: dto.name,
        },
      });

      return tx.driver.create({
        data: {
          organizationId,
          name: dto.name,
          phone: dto.phone,
          email,
          status: dto.status ?? DriverStatus.AVAILABLE,
          userId: userRecord.id,
          vehicleId: dto.vehicleId,
        },
      });
    });

    return toDriverResponse(created);
  }

  async update(
    user: JwtPayload,
    id: string,
    dto: UpdateDriverDto,
  ): Promise<DriverResponse> {
    const existing = await this.findScopedOrThrow(user, id);
    await this.assertUserInOrg(user, dto.userId ?? undefined, id);
    await this.assertVehicleInOrg(user, dto.vehicleId ?? undefined);

    const email =
      dto.email !== undefined
        ? dto.email
          ? dto.email.toLowerCase()
          : null
        : undefined;

    if (email && existing.userId) {
      const clash = await this.prisma.user.findFirst({
        where: {
          organizationId: existing.organizationId,
          email,
          NOT: { id: existing.userId },
        },
      });
      if (clash) {
        throw new ConflictException(
          'E-posten er allerede i bruk i denne organisasjonen',
        );
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (existing.userId) {
        const userData: {
          email?: string;
          name?: string;
          passwordHash?: string;
        } = {};
        if (email !== undefined) {
          userData.email = email ?? undefined;
        }
        if (dto.name !== undefined) {
          userData.name = dto.name;
        }
        if (dto.password) {
          userData.passwordHash = await bcrypt.hash(dto.password, 12);
        }
        if (Object.keys(userData).length > 0) {
          await tx.user.update({
            where: { id: existing.userId },
            data: userData,
          });
        }
      } else if (dto.password) {
        throw new BadRequestException(
          'Sjåføren har ingen brukerkonto — opprett på nytt med e-post og passord',
        );
      }

      return tx.driver.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.phone !== undefined && { phone: dto.phone }),
          ...(email !== undefined && { email }),
          ...(dto.status !== undefined && { status: dto.status }),
          ...(dto.userId !== undefined && { userId: dto.userId }),
          ...(dto.vehicleId !== undefined && { vehicleId: dto.vehicleId }),
        },
      });
    });

    return toDriverResponse(updated);
  }

  async remove(user: JwtPayload, id: string): Promise<void> {
    const driver = await this.findScopedOrThrow(user, id);
    if (driver.activeRouteId) {
      throw new BadRequestException(
        'Kan ikke slette sjåfør med aktiv rute',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.driver.delete({ where: { id } });
      if (driver.userId) {
        const linkedUser = await tx.user.findUnique({
          where: { id: driver.userId },
        });
        if (linkedUser?.role === UserRole.DRIVER) {
          await tx.user.delete({ where: { id: driver.userId } });
        }
      }
    });
  }

  private async findScopedOrThrow(user: JwtPayload, id: string) {
    const row = await this.prisma.driver.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
    });
    if (!row) {
      throw new NotFoundException('Sjåfør ikke funnet');
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
      throw new BadRequestException('Bruker ikke funnet i organisasjonen');
    }
    if (found.role !== UserRole.DRIVER) {
      throw new BadRequestException('Brukeren må ha rolle DRIVER');
    }
    const linked = await this.prisma.driver.findUnique({ where: { userId } });
    if (linked && linked.id !== excludeDriverId) {
      throw new BadRequestException('Brukeren er allerede koblet til en sjåfør');
    }
  }

  private async assertVehicleInOrg(user: JwtPayload, vehicleId?: string) {
    if (!vehicleId) return;
    const found = await this.prisma.vehicle.findFirst({
      where: this.orgScope.forOrganization(user, { id: vehicleId }),
    });
    if (!found) {
      throw new BadRequestException('Kjøretøy ikke funnet i organisasjonen');
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
