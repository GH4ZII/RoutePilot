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
exports.RoutesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const decimal_util_1 = require("../common/decimal.util");
const driver_scope_service_1 = require("../common/driver-scope.service");
const org_scope_service_1 = require("../common/org-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
const routeInclude = {
    vehicle: true,
    driver: true,
    stops: {
        orderBy: { stopOrder: 'asc' },
        include: { delivery: true },
    },
};
let RoutesService = class RoutesService {
    prisma;
    orgScope;
    driverScope;
    constructor(prisma, orgScope, driverScope) {
        this.prisma = prisma;
        this.orgScope = orgScope;
        this.driverScope = driverScope;
    }
    async findAll(user, query) {
        const rows = await this.prisma.route.findMany({
            where: this.orgScope.forOrganization(user, query.status ? { status: query.status } : {}),
            include: routeInclude,
            orderBy: [{ plannedDate: 'desc' }, { createdAt: 'desc' }],
        });
        return rows.map(toRouteResponse);
    }
    async findOne(user, id) {
        const row = await this.findScopedOrThrow(user, id);
        if (user.role === client_1.UserRole.DRIVER) {
            const driver = await this.driverScope.requireDriverForUser(user);
            if (row.driverId !== driver.id) {
                throw new common_1.ForbiddenException('Du har ikke tilgang til denne ruten');
            }
        }
        return toRouteResponse(row);
    }
    async findMyRoutes(user) {
        const driver = await this.driverScope.requireDriverForUser(user);
        const today = todayUtcDate();
        const rows = await this.prisma.route.findMany({
            where: {
                organizationId: user.organizationId,
                driverId: driver.id,
                OR: [
                    { status: client_1.RouteStatus.IN_PROGRESS },
                    {
                        plannedDate: { gte: today },
                        status: {
                            in: [client_1.RouteStatus.PLANNED, client_1.RouteStatus.ASSIGNED],
                        },
                    },
                ],
            },
            include: routeInclude,
        });
        rows.sort((a, b) => {
            if (a.status === client_1.RouteStatus.IN_PROGRESS && b.status !== client_1.RouteStatus.IN_PROGRESS) {
                return -1;
            }
            if (b.status === client_1.RouteStatus.IN_PROGRESS && a.status !== client_1.RouteStatus.IN_PROGRESS) {
                return 1;
            }
            const dateDiff = a.plannedDate.getTime() - b.plannedDate.getTime();
            if (dateDiff !== 0) {
                return dateDiff;
            }
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return rows.map(toRouteResponse);
    }
    async findMyToday(user) {
        const routes = await this.findMyRoutes(user);
        return routes[0] ?? null;
    }
    async assign(user, id, driverId) {
        this.assertStaff(user);
        const route = await this.findScopedOrThrow(user, id);
        if (route.status !== client_1.RouteStatus.PLANNED &&
            route.status !== client_1.RouteStatus.ASSIGNED) {
            throw new common_1.BadRequestException('Ruten kan kun tildeles når status er PLANNED eller ASSIGNED');
        }
        const driver = await this.prisma.driver.findFirst({
            where: this.orgScope.forOrganization(user, { id: driverId }),
        });
        if (!driver) {
            throw new common_1.NotFoundException('Sjåfør ikke funnet');
        }
        if (driver.status !== client_1.DriverStatus.AVAILABLE) {
            throw new common_1.BadRequestException('Sjåføren må være AVAILABLE for tildeling');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            if (route.driverId && route.driverId !== driverId) {
                await tx.driver.updateMany({
                    where: { activeRouteId: route.id },
                    data: { activeRouteId: null },
                });
            }
            return tx.route.update({
                where: { id: route.id },
                data: {
                    driverId,
                    status: client_1.RouteStatus.ASSIGNED,
                },
                include: routeInclude,
            });
        });
        return toRouteResponse(updated);
    }
    async start(user, id) {
        const route = await this.findScopedOrThrow(user, id);
        await this.assertDriverCanOperate(user, route);
        if (route.status !== client_1.RouteStatus.ASSIGNED &&
            route.status !== client_1.RouteStatus.PLANNED) {
            throw new common_1.BadRequestException('Ruten kan startes fra status PLANNED eller ASSIGNED');
        }
        const driverId = route.driverId;
        if (!driverId) {
            throw new common_1.BadRequestException('Ruten må ha tildelt sjåfør før start');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            await tx.driver.update({
                where: { id: driverId },
                data: {
                    status: client_1.DriverStatus.ON_ROUTE,
                    activeRouteId: route.id,
                },
            });
            const next = await tx.route.update({
                where: { id: route.id },
                data: {
                    status: client_1.RouteStatus.IN_PROGRESS,
                    startedAt: new Date(),
                },
                include: routeInclude,
            });
            await tx.routeEvent.create({
                data: {
                    routeId: route.id,
                    type: client_1.RouteEventType.ROUTE_STARTED,
                },
            });
            return next;
        });
        return toRouteResponse(updated);
    }
    async finish(user, id) {
        const route = await this.findScopedOrThrow(user, id);
        await this.assertDriverCanOperate(user, route);
        if (route.status !== client_1.RouteStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Ruten må være IN_PROGRESS for å fullføres');
        }
        const pendingStops = route.stops.filter((s) => s.status === client_1.RouteStopStatus.PENDING ||
            s.status === client_1.RouteStopStatus.IN_PROGRESS);
        if (pendingStops.length > 0) {
            throw new common_1.BadRequestException('Alle stopp må være fullført eller markert som feilet før ruten avsluttes');
        }
        const driverId = route.driverId;
        const updated = await this.prisma.$transaction(async (tx) => {
            if (driverId) {
                await tx.driver.update({
                    where: { id: driverId },
                    data: {
                        status: client_1.DriverStatus.AVAILABLE,
                        activeRouteId: null,
                    },
                });
            }
            const next = await tx.route.update({
                where: { id: route.id },
                data: {
                    status: client_1.RouteStatus.COMPLETED,
                    finishedAt: new Date(),
                },
                include: routeInclude,
            });
            await tx.routeEvent.create({
                data: {
                    routeId: route.id,
                    type: client_1.RouteEventType.ROUTE_FINISHED,
                },
            });
            return next;
        });
        return toRouteResponse(updated);
    }
    async findStopScoped(user, stopId) {
        const stop = await this.prisma.routeStop.findFirst({
            where: {
                id: stopId,
                route: this.orgScope.forOrganization(user),
            },
            include: {
                delivery: true,
                route: { include: routeInclude },
            },
        });
        if (!stop) {
            throw new common_1.NotFoundException('Rutestopp ikke funnet');
        }
        return stop;
    }
    assertStaff(user) {
        if (user.role !== client_1.UserRole.ADMIN &&
            user.role !== client_1.UserRole.DISPATCHER) {
            throw new common_1.ForbiddenException();
        }
    }
    async assertDriverCanOperate(user, route) {
        if (user.role === client_1.UserRole.ADMIN || user.role === client_1.UserRole.DISPATCHER) {
            return;
        }
        if (user.role !== client_1.UserRole.DRIVER) {
            throw new common_1.ForbiddenException();
        }
        const driver = await this.driverScope.requireDriverForUser(user);
        if (route.driverId !== driver.id) {
            throw new common_1.ForbiddenException('Du har ikke tilgang til denne ruten');
        }
    }
    async findScopedOrThrow(user, id) {
        const row = await this.prisma.route.findFirst({
            where: this.orgScope.forOrganization(user, { id }),
            include: routeInclude,
        });
        if (!row) {
            throw new common_1.NotFoundException('Rute ikke funnet');
        }
        return row;
    }
};
exports.RoutesService = RoutesService;
exports.RoutesService = RoutesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService,
        driver_scope_service_1.DriverScopeService])
], RoutesService);
function todayUtcDate() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
function toRouteResponse(route) {
    return {
        id: route.id,
        organizationId: route.organizationId,
        driverId: route.driverId,
        vehicleId: route.vehicleId,
        status: route.status,
        plannedDate: route.plannedDate,
        totalDistanceMeters: route.totalDistanceMeters,
        totalDurationSeconds: route.totalDurationSeconds,
        capacityUsedKg: route.capacityUsedKg != null
            ? (0, decimal_util_1.decimalToNumber)(route.capacityUsedKg)
            : null,
        startedAt: route.startedAt,
        finishedAt: route.finishedAt,
        createdAt: route.createdAt,
        updatedAt: route.updatedAt,
        vehicle: route.vehicle
            ? {
                id: route.vehicle.id,
                name: route.vehicle.name,
                startAddress: route.vehicle.startAddress,
                endAddress: route.vehicle.endAddress,
                startLatitude: (0, decimal_util_1.decimalToNumber)(route.vehicle.startLatitude),
                startLongitude: (0, decimal_util_1.decimalToNumber)(route.vehicle.startLongitude),
                endLatitude: (0, decimal_util_1.decimalToNumber)(route.vehicle.endLatitude),
                endLongitude: (0, decimal_util_1.decimalToNumber)(route.vehicle.endLongitude),
            }
            : null,
        driver: route.driver
            ? {
                id: route.driver.id,
                name: route.driver.name,
                phone: route.driver.phone,
            }
            : null,
        stops: route.stops.map((stop) => ({
            id: stop.id,
            stopOrder: stop.stopOrder,
            estimatedArrival: stop.estimatedArrival,
            actualArrival: stop.actualArrival,
            status: stop.status,
            delivery: {
                id: stop.delivery.id,
                customerName: stop.delivery.customerName,
                phone: stop.delivery.phone,
                address: stop.delivery.address,
                latitude: (0, decimal_util_1.decimalToNumber)(stop.delivery.latitude),
                longitude: (0, decimal_util_1.decimalToNumber)(stop.delivery.longitude),
                weightKg: (0, decimal_util_1.decimalToNumber)(stop.delivery.weightKg),
                volumeM3: stop.delivery.volumeM3 != null
                    ? (0, decimal_util_1.decimalToNumber)(stop.delivery.volumeM3)
                    : null,
                notes: stop.delivery.notes,
                status: stop.delivery.status,
                priority: stop.delivery.priority,
            },
        })),
    };
}
//# sourceMappingURL=routes.service.js.map