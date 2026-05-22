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
exports.RouteStopsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const driver_scope_service_1 = require("../common/driver-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
const routes_service_1 = require("../routes/routes.service");
let RouteStopsService = class RouteStopsService {
    prisma;
    routes;
    driverScope;
    constructor(prisma, routes, driverScope) {
        this.prisma = prisma;
        this.routes = routes;
        this.driverScope = driverScope;
    }
    async complete(user, stopId) {
        const stop = await this.routes.findStopScoped(user, stopId);
        await this.assertCanEditStop(user, stop.route);
        if (stop.route.status !== client_1.RouteStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Ruten må være startet');
        }
        if (stop.status !== client_1.RouteStopStatus.PENDING) {
            throw new common_1.BadRequestException('Stoppet er allerede behandlet');
        }
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            await tx.routeStop.update({
                where: { id: stop.id },
                data: {
                    status: client_1.RouteStopStatus.COMPLETED,
                    actualArrival: now,
                },
            });
            await tx.delivery.update({
                where: { id: stop.deliveryId },
                data: { status: client_1.DeliveryStatus.DELIVERED },
            });
            await tx.routeEvent.create({
                data: {
                    routeId: stop.routeId,
                    type: client_1.RouteEventType.STOP_COMPLETED,
                    metadata: { routeStopId: stop.id, deliveryId: stop.deliveryId },
                },
            });
        });
        return this.routes.findOne(user, stop.routeId);
    }
    async fail(user, stopId, dto) {
        const stop = await this.routes.findStopScoped(user, stopId);
        await this.assertCanEditStop(user, stop.route);
        if (stop.route.status !== client_1.RouteStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Ruten må være startet');
        }
        if (stop.status !== client_1.RouteStopStatus.PENDING) {
            throw new common_1.BadRequestException('Stoppet er allerede behandlet');
        }
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            await tx.routeStop.update({
                where: { id: stop.id },
                data: {
                    status: client_1.RouteStopStatus.FAILED,
                    actualArrival: now,
                },
            });
            await tx.delivery.update({
                where: { id: stop.deliveryId },
                data: { status: client_1.DeliveryStatus.FAILED },
            });
            await tx.routeEvent.create({
                data: {
                    routeId: stop.routeId,
                    type: client_1.RouteEventType.STOP_FAILED,
                    metadata: {
                        routeStopId: stop.id,
                        deliveryId: stop.deliveryId,
                        reason: dto.reason ?? null,
                    },
                },
            });
        });
        return this.routes.findOne(user, stop.routeId);
    }
    async submitProof(user, stopId, dto) {
        const stop = await this.routes.findStopScoped(user, stopId);
        await this.assertCanEditStop(user, stop.route);
        if (stop.status !== client_1.RouteStopStatus.COMPLETED) {
            throw new common_1.BadRequestException('Leveringsbevis kan kun registreres etter at stoppet er fullført');
        }
        const existing = await this.prisma.proofOfDelivery.findUnique({
            where: { routeStopId: stop.id },
        });
        if (existing) {
            throw new common_1.BadRequestException('Leveringsbevis er allerede registrert');
        }
        await this.prisma.proofOfDelivery.create({
            data: {
                routeStopId: stop.id,
                note: dto.note,
                photoUrl: dto.photoUrl,
                latitude: dto.latitude,
                longitude: dto.longitude,
                capturedAt: new Date(),
            },
        });
        return this.routes.findOne(user, stop.routeId);
    }
    async assertCanEditStop(user, route) {
        if (user.role === client_1.UserRole.ADMIN || user.role === client_1.UserRole.DISPATCHER) {
            return;
        }
        if (user.role !== client_1.UserRole.DRIVER) {
            throw new common_1.ForbiddenException();
        }
        const driver = await this.driverScope.requireDriverForUser(user);
        if (route.driverId !== driver.id) {
            throw new common_1.ForbiddenException('Du har ikke tilgang til dette stoppet');
        }
    }
};
exports.RouteStopsService = RouteStopsService;
exports.RouteStopsService = RouteStopsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        routes_service_1.RoutesService,
        driver_scope_service_1.DriverScopeService])
], RouteStopsService);
//# sourceMappingURL=route-stops.service.js.map