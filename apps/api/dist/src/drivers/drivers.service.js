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
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const org_scope_service_1 = require("../common/org-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
let DriversService = class DriversService {
    prisma;
    orgScope;
    constructor(prisma, orgScope) {
        this.prisma = prisma;
        this.orgScope = orgScope;
    }
    async findAll(user, query) {
        const rows = await this.prisma.driver.findMany({
            where: this.orgScope.forOrganization(user, query.status ? { status: query.status } : {}),
            orderBy: { name: 'asc' },
        });
        return rows.map(toDriverResponse);
    }
    async findOne(user, id) {
        const row = await this.findScopedOrThrow(user, id);
        return toDriverResponse(row);
    }
    async create(user, dto) {
        const organizationId = this.orgScope.requireOrganizationId(user);
        await this.assertUserInOrg(user, dto.userId);
        await this.assertVehicleInOrg(user, dto.vehicleId);
        const created = await this.prisma.driver.create({
            data: {
                organizationId,
                name: dto.name,
                phone: dto.phone,
                email: dto.email?.toLowerCase(),
                status: dto.status ?? client_1.DriverStatus.AVAILABLE,
                userId: dto.userId,
                vehicleId: dto.vehicleId,
            },
        });
        return toDriverResponse(created);
    }
    async update(user, id, dto) {
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
    async remove(user, id) {
        const driver = await this.findScopedOrThrow(user, id);
        if (driver.activeRouteId) {
            throw new common_1.BadRequestException('Cannot delete a driver with an active route');
        }
        await this.prisma.driver.delete({ where: { id } });
    }
    async findScopedOrThrow(user, id) {
        const row = await this.prisma.driver.findFirst({
            where: this.orgScope.forOrganization(user, { id }),
        });
        if (!row) {
            throw new common_1.NotFoundException('Driver not found');
        }
        return row;
    }
    async assertUserInOrg(user, userId, excludeDriverId) {
        if (!userId)
            return;
        const found = await this.prisma.user.findFirst({
            where: this.orgScope.forOrganization(user, { id: userId }),
        });
        if (!found) {
            throw new common_1.BadRequestException('User not found in this organization');
        }
        const linked = await this.prisma.driver.findUnique({ where: { userId } });
        if (linked && linked.id !== excludeDriverId) {
            throw new common_1.BadRequestException('User is already linked to a driver');
        }
    }
    async assertVehicleInOrg(user, vehicleId) {
        if (!vehicleId)
            return;
        const found = await this.prisma.vehicle.findFirst({
            where: this.orgScope.forOrganization(user, { id: vehicleId }),
        });
        if (!found) {
            throw new common_1.BadRequestException('Vehicle not found in this organization');
        }
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService])
], DriversService);
function toDriverResponse(driver) {
    return { ...driver };
}
//# sourceMappingURL=drivers.service.js.map