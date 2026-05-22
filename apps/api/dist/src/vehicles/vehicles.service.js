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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const decimal_util_1 = require("../common/decimal.util");
const org_scope_service_1 = require("../common/org-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
let VehiclesService = class VehiclesService {
    prisma;
    orgScope;
    constructor(prisma, orgScope) {
        this.prisma = prisma;
        this.orgScope = orgScope;
    }
    async findAll(user, query) {
        const rows = await this.prisma.vehicle.findMany({
            where: this.orgScope.forOrganization(user, query.status ? { status: query.status } : {}),
            orderBy: { name: 'asc' },
        });
        return rows.map(toVehicleResponse);
    }
    async findOne(user, id) {
        const row = await this.findScopedOrThrow(user, id);
        return toVehicleResponse(row);
    }
    async create(user, dto) {
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
                    status: dto.status ?? client_1.VehicleStatus.AVAILABLE,
                },
            });
            return toVehicleResponse(created);
        }
        catch (error) {
            if (isUniqueViolation(error)) {
                throw new common_1.ConflictException('Registration number already in use in this organization');
            }
            throw error;
        }
    }
    async update(user, id, dto) {
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
        }
        catch (error) {
            if (isUniqueViolation(error)) {
                throw new common_1.ConflictException('Registration number already in use in this organization');
            }
            throw error;
        }
    }
    async remove(user, id) {
        await this.findScopedOrThrow(user, id);
        const assignedDrivers = await this.prisma.driver.count({
            where: { vehicleId: id },
        });
        if (assignedDrivers > 0) {
            throw new common_1.BadRequestException('Cannot delete a vehicle assigned to drivers');
        }
        const routes = await this.prisma.route.count({ where: { vehicleId: id } });
        if (routes > 0) {
            throw new common_1.BadRequestException('Cannot delete a vehicle used on routes');
        }
        await this.prisma.vehicle.delete({ where: { id } });
    }
    async findScopedOrThrow(user, id) {
        const row = await this.prisma.vehicle.findFirst({
            where: this.orgScope.forOrganization(user, { id }),
        });
        if (!row) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return row;
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService])
], VehiclesService);
function toVehicleResponse(vehicle) {
    return {
        id: vehicle.id,
        organizationId: vehicle.organizationId,
        name: vehicle.name,
        registrationNumber: vehicle.registrationNumber,
        maxWeightKg: (0, decimal_util_1.decimalToNumber)(vehicle.maxWeightKg),
        maxVolumeM3: (0, decimal_util_1.decimalToNumber)(vehicle.maxVolumeM3),
        startLatitude: (0, decimal_util_1.decimalToNumber)(vehicle.startLatitude),
        startLongitude: (0, decimal_util_1.decimalToNumber)(vehicle.startLongitude),
        endLatitude: (0, decimal_util_1.decimalToNumber)(vehicle.endLatitude),
        endLongitude: (0, decimal_util_1.decimalToNumber)(vehicle.endLongitude),
        status: vehicle.status,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
    };
}
function isUniqueViolation(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002');
}
//# sourceMappingURL=vehicles.service.js.map