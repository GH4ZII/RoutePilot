import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { OrgScopeService } from '../common/org-scope.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepotDto } from './dto/create-depot.dto';
import { UpdateDepotDto } from './dto/update-depot.dto';

export type DepotResponse = {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class DepotsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
    private readonly geocoding: GeocodingService,
  ) {}

  async findAll(user: JwtPayload): Promise<DepotResponse[]> {
    const rows = await this.prisma.depot.findMany({
      where: this.orgScope.forOrganization(user, {}),
      orderBy: { name: 'asc' },
    });
    return rows.map(toDepotResponse);
  }

  async findOne(user: JwtPayload, id: string): Promise<DepotResponse> {
    const row = await this.findScopedOrThrow(user, id);
    return toDepotResponse(row);
  }

  async create(user: JwtPayload, dto: CreateDepotDto): Promise<DepotResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);
    const address = dto.address.trim();
    const location = await this.geocoding.geocode(address);

    const created = await this.prisma.depot.create({
      data: {
        organizationId,
        name: dto.name.trim(),
        address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
    return toDepotResponse(created);
  }

  async update(
    user: JwtPayload,
    id: string,
    dto: UpdateDepotDto,
  ): Promise<DepotResponse> {
    const existing = await this.findScopedOrThrow(user, id);
    let latitude = decimalToNumber(existing.latitude)!;
    let longitude = decimalToNumber(existing.longitude)!;
    let address = existing.address;

    if (dto.address !== undefined) {
      address = dto.address.trim();
      const location = await this.geocoding.geocode(address);
      latitude = location.latitude;
      longitude = location.longitude;
    }

    const updated = await this.prisma.depot.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.address !== undefined && { address, latitude, longitude }),
      },
    });
    return toDepotResponse(updated);
  }

  async remove(user: JwtPayload, id: string): Promise<void> {
    await this.findScopedOrThrow(user, id);
    const vehicles = await this.prisma.vehicle.count({
      where: { depotId: id },
    });
    if (vehicles > 0) {
      throw new BadRequestException(
        'Kan ikke slette depot med tilknyttede kjøretøy',
      );
    }
    await this.prisma.depot.delete({ where: { id } });
  }

  private async findScopedOrThrow(user: JwtPayload, id: string) {
    const row = await this.prisma.depot.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
    });
    if (!row) {
      throw new NotFoundException('Depot ikke funnet');
    }
    return row;
  }
}

function toDepotResponse(depot: {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  latitude: Parameters<typeof decimalToNumber>[0];
  longitude: Parameters<typeof decimalToNumber>[0];
  createdAt: Date;
  updatedAt: Date;
}): DepotResponse {
  return {
    id: depot.id,
    organizationId: depot.organizationId,
    name: depot.name,
    address: depot.address,
    latitude: decimalToNumber(depot.latitude)!,
    longitude: decimalToNumber(depot.longitude)!,
    createdAt: depot.createdAt,
    updatedAt: depot.updatedAt,
  };
}
