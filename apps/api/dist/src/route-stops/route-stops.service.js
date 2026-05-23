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
const decimal_util_1 = require("../common/decimal.util");
const driver_scope_service_1 = require("../common/driver-scope.service");
const events_service_1 = require("../events/events.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const routes_service_1 = require("../routes/routes.service");
let RouteStopsService = class RouteStopsService {
    prisma;
    routes;
    driverScope;
    events;
    notifications;
    constructor(prisma, routes, driverScope, events, notifications) {
        this.prisma = prisma;
        this.routes = routes;
        this.driverScope = driverScope;
        this.events = events;
        this.notifications = notifications;
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
        await this.notifications.enqueueForStop(user.organizationId, stop.deliveryId, client_1.NotificationType.DELIVERED, { routeStopId: stop.id });
        this.events.publish(user.organizationId, 'stop.updated', {
            routeId: stop.routeId,
            stopId: stop.id,
            status: client_1.RouteStopStatus.COMPLETED,
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
        await this.notifications.enqueueForStop(user.organizationId, stop.deliveryId, client_1.NotificationType.FAILED, { routeStopId: stop.id, reason: dto.reason ?? null });
        this.events.publish(user.organizationId, 'stop.updated', {
            routeId: stop.routeId,
            stopId: stop.id,
            status: client_1.RouteStopStatus.FAILED,
        });
        return this.routes.findOne(user, stop.routeId);
    }
    async getProof(user, stopId) {
        const stop = await this.routes.findStopScoped(user, stopId);
        const proof = await this.prisma.proofOfDelivery.findUnique({
            where: { routeStopId: stop.id },
        });
        if (!proof) {
            throw new common_1.NotFoundException('Leveringsbevis ikke funnet');
        }
        return toProofResponse(proof);
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
        const capturedAt = resolveCapturedAt(dto.capturedAt);
        await this.prisma.proofOfDelivery.create({
            data: {
                routeStopId: stop.id,
                note: dto.note,
                photoUrl: dto.photoUrl,
                signatureUrl: dto.signatureUrl,
                latitude: dto.latitude,
                longitude: dto.longitude,
                capturedAt,
            },
        });
        this.events.publish(user.organizationId, 'stop.updated', {
            routeId: stop.routeId,
            stopId: stop.id,
            proofSubmitted: true,
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
        driver_scope_service_1.DriverScopeService,
        events_service_1.EventsService,
        notifications_service_1.NotificationsService])
], RouteStopsService);
function resolveCapturedAt(value) {
    if (!value)
        return new Date();
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw new common_1.BadRequestException('Ugyldig capturedAt');
    }
    const now = Date.now();
    const diff = Math.abs(now - parsed.getTime());
    if (diff > 5 * 60 * 1000) {
        throw new common_1.BadRequestException('capturedAt må være innen 5 minutter fra nå');
    }
    return parsed;
}
function toProofResponse(proof) {
    return {
        id: proof.id,
        routeStopId: proof.routeStopId,
        photoUrl: proof.photoUrl,
        signatureUrl: proof.signatureUrl,
        note: proof.note,
        latitude: proof.latitude != null ? (0, decimal_util_1.decimalToNumber)(proof.latitude) : null,
        longitude: proof.longitude != null ? (0, decimal_util_1.decimalToNumber)(proof.longitude) : null,
        capturedAt: proof.capturedAt,
    };
}
//# sourceMappingURL=route-stops.service.js.map