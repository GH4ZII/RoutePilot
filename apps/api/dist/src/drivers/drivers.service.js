"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("../generated/prisma/client");
const org_scope_service_1 = require("../common/org-scope.service");
const events_service_1 = require("../events/events.service");
const prisma_service_1 = require("../prisma/prisma.service");
let DriversService = class DriversService {
    prisma;
    orgScope;
    events;
    constructor(prisma, orgScope, events) {
        this.prisma = prisma;
        this.orgScope = orgScope;
        this.events = events;
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
        await this.assertVehicleInOrg(user, dto.vehicleId);
        if (dto.userId) {
            await this.assertUserInOrg(user, dto.userId);
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
        if (!dto.email || !dto.password) {
            throw new common_1.BadRequestException('E-post og passord er påkrevd for å opprette sjåfør med innlogging');
        }
        const email = dto.email.toLowerCase();
        const existingUser = await this.prisma.user.findUnique({
            where: { organizationId_email: { organizationId, email } },
        });
        if (existingUser) {
            throw new common_1.ConflictException('E-posten er allerede i bruk i denne organisasjonen');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const created = await this.prisma.$transaction(async (tx) => {
            const userRecord = await tx.user.create({
                data: {
                    organizationId,
                    email,
                    passwordHash,
                    role: client_1.UserRole.DRIVER,
                    name: dto.name,
                },
            });
            return tx.driver.create({
                data: {
                    organizationId,
                    name: dto.name,
                    phone: dto.phone,
                    email,
                    status: dto.status ?? client_1.DriverStatus.AVAILABLE,
                    userId: userRecord.id,
                    vehicleId: dto.vehicleId,
                },
            });
        });
        return toDriverResponse(created);
    }
    async update(user, id, dto) {
        const existing = await this.findScopedOrThrow(user, id);
        await this.assertUserInOrg(user, dto.userId ?? undefined, id);
        await this.assertVehicleInOrg(user, dto.vehicleId ?? undefined);
        const email = dto.email !== undefined
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
                throw new common_1.ConflictException('E-posten er allerede i bruk i denne organisasjonen');
            }
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            if (existing.userId) {
                const userData = {};
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
            }
            else if (dto.password) {
                throw new common_1.BadRequestException('Sjåføren har ingen brukerkonto — opprett på nytt med e-post og passord');
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
    async remove(user, id) {
        const driver = await this.findScopedOrThrow(user, id);
        if (driver.activeRouteId) {
            throw new common_1.BadRequestException('Kan ikke slette sjåfør med aktiv rute');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.driver.delete({ where: { id } });
            if (driver.userId) {
                const linkedUser = await tx.user.findUnique({
                    where: { id: driver.userId },
                });
                if (linkedUser?.role === client_1.UserRole.DRIVER) {
                    await tx.user.delete({ where: { id: driver.userId } });
                }
            }
        });
    }
    async updateMyLocation(user, dto) {
        const driver = await this.prisma.driver.findFirst({
            where: this.orgScope.forOrganization(user, { userId: user.sub }),
            include: { activeRoute: true },
        });
        if (!driver) {
            throw new common_1.NotFoundException('Sjåførprofil ikke funnet');
        }
        if (!driver.activeRoute ||
            driver.activeRoute.status !== client_1.RouteStatus.IN_PROGRESS) {
            throw new common_1.ForbiddenException('Posisjon kan kun oppdateres under aktiv rute');
        }
        const now = new Date();
        const location = await this.prisma.driverLocation.upsert({
            where: { driverId: driver.id },
            create: {
                driverId: driver.id,
                latitude: dto.latitude,
                longitude: dto.longitude,
                heading: dto.heading,
                speed: dto.speed,
                recordedAt: now,
            },
            update: {
                latitude: dto.latitude,
                longitude: dto.longitude,
                heading: dto.heading,
                speed: dto.speed,
                recordedAt: now,
            },
        });
        const response = {
            driverId: location.driverId,
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            heading: location.heading != null ? Number(location.heading) : null,
            speed: location.speed != null ? Number(location.speed) : null,
            recordedAt: location.recordedAt,
        };
        this.events.publish(user.organizationId, 'driver.location', {
            routeId: driver.activeRouteId,
            ...response,
        });
        return response;
    }
    async findScopedOrThrow(user, id) {
        const row = await this.prisma.driver.findFirst({
            where: this.orgScope.forOrganization(user, { id }),
        });
        if (!row) {
            throw new common_1.NotFoundException('Sjåfør ikke funnet');
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
            throw new common_1.BadRequestException('Bruker ikke funnet i organisasjonen');
        }
        if (found.role !== client_1.UserRole.DRIVER) {
            throw new common_1.BadRequestException('Brukeren må ha rolle DRIVER');
        }
        const linked = await this.prisma.driver.findUnique({ where: { userId } });
        if (linked && linked.id !== excludeDriverId) {
            throw new common_1.BadRequestException('Brukeren er allerede koblet til en sjåfør');
        }
    }
    async assertVehicleInOrg(user, vehicleId) {
        if (!vehicleId)
            return;
        const found = await this.prisma.vehicle.findFirst({
            where: this.orgScope.forOrganization(user, { id: vehicleId }),
        });
        if (!found) {
            throw new common_1.BadRequestException('Kjøretøy ikke funnet i organisasjonen');
        }
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService,
        events_service_1.EventsService])
], DriversService);
function toDriverResponse(driver) {
    return { ...driver };
}
//# sourceMappingURL=drivers.service.js.map