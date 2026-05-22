"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveriesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const decimal_util_1 = require("../common/decimal.util");
const org_scope_service_1 = require("../common/org-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
let DeliveriesService = class DeliveriesService {
    prisma;
    orgScope;
    constructor(prisma, orgScope) {
        this.prisma = prisma;
        this.orgScope = orgScope;
    }
    async findAll(user, query) {
        const rows = await this.prisma.delivery.findMany({
            where: this.orgScope.forOrganization(user, query.status ? { status: query.status } : {}),
            orderBy: [{ priority: 'desc' }, { deadline: 'asc' }, { createdAt: 'desc' }],
        });
        return rows.map(toDeliveryResponse);
    }
    async findOne(user, id) {
        const row = await this.findScopedOrThrow(user, id);
        return toDeliveryResponse(row);
    }
    async create(user, dto) {
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
                priority: dto.priority ?? client_1.DeliveryPriority.NORMAL,
                deadline: parseOptionalDate(dto.deadline),
                timeWindowStart: parseOptionalDate(dto.timeWindowStart),
                timeWindowEnd: parseOptionalDate(dto.timeWindowEnd),
                notes: dto.notes,
                status: dto.status ?? client_1.DeliveryStatus.PENDING,
            },
        });
        return toDeliveryResponse(created);
    }
    async update(user, id, dto) {
        const existing = await this.findScopedOrThrow(user, id);
        const timeWindowStart = dto.timeWindowStart !== undefined
            ? parseNullableDate(dto.timeWindowStart)
            : existing.timeWindowStart;
        const timeWindowEnd = dto.timeWindowEnd !== undefined
            ? parseNullableDate(dto.timeWindowEnd)
            : existing.timeWindowEnd;
        this.assertTimeWindow(timeWindowStart?.toISOString(), timeWindowEnd?.toISOString());
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
    async remove(user, id) {
        await this.findScopedOrThrow(user, id);
        const stops = await this.prisma.routeStop.count({
            where: { deliveryId: id },
        });
        if (stops > 0) {
            throw new common_1.BadRequestException('Cannot delete a delivery that is part of a route');
        }
        await this.prisma.delivery.delete({ where: { id } });
    }
    async findScopedOrThrow(user, id) {
        const row = await this.prisma.delivery.findFirst({
            where: this.orgScope.forOrganization(user, { id }),
        });
        if (!row) {
            throw new common_1.NotFoundException('Delivery not found');
        }
        return row;
    }
    assertTimeWindow(start, end) {
        if (start && end && new Date(start) > new Date(end)) {
            throw new common_1.BadRequestException('timeWindowStart must be before timeWindowEnd');
        }
    }
};
exports.DeliveriesService = DeliveriesService;
exports.DeliveriesService = DeliveriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService])
], DeliveriesService);
function parseOptionalDate(value) {
    return value ? new Date(value) : undefined;
}
function parseNullableDate(value) {
    if (value === undefined)
        return undefined;
    if (value === null)
        return null;
    return new Date(value);
}
function toDeliveryResponse(delivery) {
    return {
        id: delivery.id,
        organizationId: delivery.organizationId,
        customerName: delivery.customerName,
        phone: delivery.phone,
        address: delivery.address,
        latitude: (0, decimal_util_1.decimalToNumber)(delivery.latitude),
        longitude: (0, decimal_util_1.decimalToNumber)(delivery.longitude),
        weightKg: (0, decimal_util_1.decimalToNumber)(delivery.weightKg),
        volumeM3: (0, decimal_util_1.decimalToNumber)(delivery.volumeM3),
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
//# sourceMappingURL=deliveries.service.js.map