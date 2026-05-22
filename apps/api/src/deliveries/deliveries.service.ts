import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DeliveryPriority,
  DeliveryStatus,
} from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { decimalToNumber } from '../common/decimal.util';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ListDeliveriesQueryDto } from './dto/list-deliveries-query.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

export type DeliveryResponse = {
  id: string;
  organizationId: string;
  customerName: string;
  phone: string | null;
  address: string;
  latitude: number;
  longitude: number;
  weightKg: number;
  volumeM3: number | null;
  priority: DeliveryPriority;
  deadline: Date | null;
  timeWindowStart: Date | null;
  timeWindowEnd: Date | null;
  notes: string | null;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class DeliveriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
  ) {}

  async findAll(
    user: JwtPayload,
    query: ListDeliveriesQueryDto,
  ): Promise<DeliveryResponse[]> {
    const rows = await this.prisma.delivery.findMany({
      where: this.orgScope.forOrganization(
        user,
        query.status ? { status: query.status } : {},
      ),
      orderBy: [{ priority: 'desc' }, { deadline: 'asc' }, { createdAt: 'desc' }],
    });
    return rows.map(toDeliveryResponse);
  }

  async findOne(user: JwtPayload, id: string): Promise<DeliveryResponse> {
    const row = await this.findScopedOrThrow(user, id);
    return toDeliveryResponse(row);
  }

  async create(
    user: JwtPayload,
    dto: CreateDeliveryDto,
  ): Promise<DeliveryResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);
    this.assertTimeWindow(dto.timeWindowStart, dto.timeWindowEnd);

    const created = await this.prisma.delivery.create({
      data: {
        organizationId,
        customerName: dto.customerName,
        phone: dto.phone,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        weightKg: dto.weightKg,
        volumeM3: dto.volumeM3,
        priority: dto.priority ?? DeliveryPriority.NORMAL,
        deadline: parseOptionalDate(dto.deadline),
        timeWindowStart: parseOptionalDate(dto.timeWindowStart),
        timeWindowEnd: parseOptionalDate(dto.timeWindowEnd),
        notes: dto.notes,
        status: dto.status ?? DeliveryStatus.PENDING,
      },
    });
    return toDeliveryResponse(created);
  }

  async update(
    user: JwtPayload,
    id: string,
    dto: UpdateDeliveryDto,
  ): Promise<DeliveryResponse> {
    const existing = await this.findScopedOrThrow(user, id);

    const timeWindowStart =
      dto.timeWindowStart !== undefined
        ? parseNullableDate(dto.timeWindowStart)
        : existing.timeWindowStart;
    const timeWindowEnd =
      dto.timeWindowEnd !== undefined
        ? parseNullableDate(dto.timeWindowEnd)
        : existing.timeWindowEnd;
    this.assertTimeWindow(
      timeWindowStart?.toISOString(),
      timeWindowEnd?.toISOString(),
    );

    const updated = await this.prisma.delivery.update({
      where: { id },
      data: {
        ...(dto.customerName !== undefined && {
          customerName: dto.customerName,
        }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.weightKg !== undefined && { weightKg: dto.weightKg }),
        ...(dto.volumeM3 !== undefined && { volumeM3: dto.volumeM3 }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.deadline !== undefined && {
          deadline: parseNullableDate(dto.deadline),
        }),
        ...(dto.timeWindowStart !== undefined && {
          timeWindowStart: parseNullableDate(dto.timeWindowStart),
        }),
        ...(dto.timeWindowEnd !== undefined && {
          timeWindowEnd: parseNullableDate(dto.timeWindowEnd),
        }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
    return toDeliveryResponse(updated);
  }

  async remove(user: JwtPayload, id: string): Promise<void> {
    await this.findScopedOrThrow(user, id);

    const stops = await this.prisma.routeStop.count({
      where: { deliveryId: id },
    });
    if (stops > 0) {
      throw new BadRequestException(
        'Cannot delete a delivery that is part of a route',
      );
    }

    await this.prisma.delivery.delete({ where: { id } });
  }

  private async findScopedOrThrow(user: JwtPayload, id: string) {
    const row = await this.prisma.delivery.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
    });
    if (!row) {
      throw new NotFoundException('Delivery not found');
    }
    return row;
  }

  private assertTimeWindow(start?: string, end?: string) {
    if (start && end && new Date(start) > new Date(end)) {
      throw new BadRequestException(
        'timeWindowStart must be before timeWindowEnd',
      );
    }
  }
}

function parseOptionalDate(value?: string): Date | undefined {
  return value ? new Date(value) : undefined;
}

function parseNullableDate(value?: string | null): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return new Date(value);
}

function toDeliveryResponse(delivery: {
  id: string;
  organizationId: string;
  customerName: string;
  phone: string | null;
  address: string;
  latitude: Parameters<typeof decimalToNumber>[0];
  longitude: Parameters<typeof decimalToNumber>[0];
  weightKg: Parameters<typeof decimalToNumber>[0];
  volumeM3: Parameters<typeof decimalToNumber>[0];
  priority: DeliveryPriority;
  deadline: Date | null;
  timeWindowStart: Date | null;
  timeWindowEnd: Date | null;
  notes: string | null;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}): DeliveryResponse {
  return {
    id: delivery.id,
    organizationId: delivery.organizationId,
    customerName: delivery.customerName,
    phone: delivery.phone,
    address: delivery.address,
    latitude: decimalToNumber(delivery.latitude)!,
    longitude: decimalToNumber(delivery.longitude)!,
    weightKg: decimalToNumber(delivery.weightKg)!,
    volumeM3: decimalToNumber(delivery.volumeM3),
    priority: delivery.priority,
    deadline: delivery.deadline,
    timeWindowStart: delivery.timeWindowStart,
    timeWindowEnd: delivery.timeWindowEnd,
    notes: delivery.notes,
    status: delivery.status,
    createdAt: delivery.createdAt,
    updatedAt: delivery.updatedAt,
  };
}
