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
const decimal_util_1 = require("../common/decimal.util");
const org_scope_service_1 = require("../common/org-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
let RoutesService = class RoutesService {
    prisma;
    orgScope;
    constructor(prisma, orgScope) {
        this.prisma = prisma;
        this.orgScope = orgScope;
    }
    async findAll(user, query) {
        const rows = await this.prisma.route.findMany({
            where: this.orgScope.forOrganization(user, query.status ? { status: query.status } : {}),
            include: {
                vehicle: true,
                stops: {
                    orderBy: { stopOrder: 'asc' },
                    include: { delivery: true },
                },
            },
            orderBy: [{ plannedDate: 'desc' }, { createdAt: 'desc' }],
        });
        return rows.map(toRouteResponse);
    }
    async findOne(user, id) {
        const row = await this.prisma.route.findFirst({
            where: this.orgScope.forOrganization(user, { id }),
            include: {
                vehicle: true,
                stops: {
                    orderBy: { stopOrder: 'asc' },
                    include: { delivery: true },
                },
            },
        });
        if (!row) {
            throw new common_1.NotFoundException('Rute ikke funnet');
        }
        return toRouteResponse(row);
    }
};
exports.RoutesService = RoutesService;
exports.RoutesService = RoutesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService])
], RoutesService);
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
        stops: route.stops.map((stop) => ({
            id: stop.id,
            stopOrder: stop.stopOrder,
            estimatedArrival: stop.estimatedArrival,
            status: stop.status,
            delivery: {
                id: stop.delivery.id,
                customerName: stop.delivery.customerName,
                address: stop.delivery.address,
                latitude: (0, decimal_util_1.decimalToNumber)(stop.delivery.latitude),
                longitude: (0, decimal_util_1.decimalToNumber)(stop.delivery.longitude),
                status: stop.delivery.status,
                priority: stop.delivery.priority,
            },
        })),
    };
}
//# sourceMappingURL=routes.service.js.map