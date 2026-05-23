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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const decimal_util_1 = require("../common/decimal.util");
const org_scope_service_1 = require("../common/org-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
const liveRouteInclude = {
    driver: true,
    vehicle: true,
    stops: {
        orderBy: { stopOrder: 'asc' },
        include: { delivery: true },
    },
};
let DashboardService = class DashboardService {
    prisma;
    orgScope;
    constructor(prisma, orgScope) {
        this.prisma = prisma;
        this.orgScope = orgScope;
    }
    async getSummary(user, query) {
        const plannedDate = this.resolvePlannedDate(query.date);
        const now = new Date();
        const [statusGroups, routeCounts, delayedCount, routesToday, alerts] = await Promise.all([
            this.prisma.delivery.groupBy({
                by: ['status'],
                where: this.orgScope.forOrganization(user),
                _count: { _all: true },
            }),
            this.getRouteCounts(user, plannedDate),
            this.countDelayedDeliveries(user, now),
            this.loadRoutesForMetrics(user, plannedDate),
            this.buildAlerts(user, plannedDate, now),
        ]);
        const deliveries = this.statusCountsToMetrics(statusGroups);
        const { averageRouteDurationSeconds, totalEstimatedDistanceMeters, capacityUtilizationPercent, } = this.computeRouteAggregates(routesToday);
        return {
            date: this.formatDate(plannedDate),
            metrics: {
                deliveries,
                routes: routeCounts,
                delayedDeliveries: delayedCount,
                averageRouteDurationSeconds,
                totalEstimatedDistanceMeters,
                capacityUtilizationPercent,
            },
            alerts,
        };
    }
    async getLiveRoutes(user, query) {
        const plannedDate = this.resolvePlannedDate(query.date);
        const now = new Date();
        const rows = await this.prisma.route.findMany({
            where: this.orgScope.forOrganization(user, {
                plannedDate,
                status: { in: [client_1.RouteStatus.ASSIGNED, client_1.RouteStatus.IN_PROGRESS] },
            }),
            include: liveRouteInclude,
            orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
        });
        const driverIds = rows
            .map((r) => r.driverId)
            .filter((id) => id != null);
        const locations = driverIds.length
            ? await this.prisma.driverLocation.findMany({
                where: { driverId: { in: driverIds } },
            })
            : [];
        const locationByDriver = new Map(locations.map((loc) => [loc.driverId, loc]));
        return rows.map((route) => {
            const stops = route.stops.map((stop) => ({
                id: stop.id,
                stopOrder: stop.stopOrder,
                status: stop.status,
                estimatedArrival: stop.estimatedArrival,
                actualArrival: stop.actualArrival,
                isDelayed: this.isStopDelayed(stop, now, route.status),
                delivery: {
                    id: stop.delivery.id,
                    customerName: stop.delivery.customerName,
                    address: stop.delivery.address,
                    latitude: (0, decimal_util_1.decimalToNumber)(stop.delivery.latitude),
                    longitude: (0, decimal_util_1.decimalToNumber)(stop.delivery.longitude),
                    status: stop.delivery.status,
                    priority: stop.delivery.priority,
                    phone: stop.delivery.phone,
                },
            }));
            return {
                id: route.id,
                status: route.status,
                plannedDate: route.plannedDate,
                driver: route.driver
                    ? {
                        id: route.driver.id,
                        name: route.driver.name,
                        phone: route.driver.phone,
                    }
                    : null,
                driverLocation: (() => {
                    if (!route.driverId)
                        return null;
                    const loc = locationByDriver.get(route.driverId);
                    if (!loc)
                        return null;
                    return {
                        latitude: (0, decimal_util_1.decimalToNumber)(loc.latitude),
                        longitude: (0, decimal_util_1.decimalToNumber)(loc.longitude),
                        recordedAt: loc.recordedAt,
                        heading: loc.heading != null ? (0, decimal_util_1.decimalToNumber)(loc.heading) : null,
                        speed: loc.speed != null ? (0, decimal_util_1.decimalToNumber)(loc.speed) : null,
                    };
                })(),
                vehicle: route.vehicle
                    ? {
                        id: route.vehicle.id,
                        name: route.vehicle.name,
                        startLatitude: (0, decimal_util_1.decimalToNumber)(route.vehicle.startLatitude),
                        startLongitude: (0, decimal_util_1.decimalToNumber)(route.vehicle.startLongitude),
                        endLatitude: (0, decimal_util_1.decimalToNumber)(route.vehicle.endLatitude),
                        endLongitude: (0, decimal_util_1.decimalToNumber)(route.vehicle.endLongitude),
                        maxWeightKg: (0, decimal_util_1.decimalToNumber)(route.vehicle.maxWeightKg),
                    }
                    : null,
                totalDistanceMeters: route.totalDistanceMeters,
                capacityUsedKg: route.capacityUsedKg != null
                    ? (0, decimal_util_1.decimalToNumber)(route.capacityUsedKg)
                    : null,
                stops,
                completedStops: stops.filter((s) => s.status === client_1.RouteStopStatus.COMPLETED)
                    .length,
                totalStops: stops.length,
            };
        });
    }
    async getDeliveriesStatus(user, query) {
        const plannedDate = this.resolvePlannedDate(query.date);
        const now = new Date();
        const [statusGroups, delayedRows] = await Promise.all([
            this.prisma.delivery.groupBy({
                by: ['status'],
                where: this.orgScope.forOrganization(user),
                _count: { _all: true },
            }),
            this.findDelayedDeliveryRows(user, now),
        ]);
        const byStatus = Object.values(client_1.DeliveryStatus).map((status) => ({
            status,
            count: statusGroups.find((g) => g.status === status)?._count._all ?? 0,
        }));
        return {
            date: this.formatDate(plannedDate),
            byStatus,
            delayed: delayedRows,
        };
    }
    resolvePlannedDate(dateParam) {
        if (dateParam) {
            const parsed = new Date(`${dateParam}T12:00:00.000Z`);
            if (!Number.isNaN(parsed.getTime())) {
                return parsed;
            }
        }
        const now = new Date();
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    }
    formatDate(date) {
        return date.toISOString().slice(0, 10);
    }
    statusCountsToMetrics(groups) {
        const count = (status) => groups.find((g) => g.status === status)?._count._all ?? 0;
        const pending = count(client_1.DeliveryStatus.PENDING);
        const assigned = count(client_1.DeliveryStatus.ASSIGNED);
        const inProgress = count(client_1.DeliveryStatus.IN_PROGRESS);
        const delivered = count(client_1.DeliveryStatus.DELIVERED);
        const failed = count(client_1.DeliveryStatus.FAILED);
        const cancelled = count(client_1.DeliveryStatus.CANCELLED);
        return {
            total: pending +
                assigned +
                inProgress +
                delivered +
                failed +
                cancelled,
            pending,
            assigned,
            inProgress,
            delivered,
            failed,
            cancelled,
        };
    }
    async getRouteCounts(user, plannedDate) {
        const base = this.orgScope.forOrganization(user);
        const [active, plannedToday, completedToday] = await Promise.all([
            this.prisma.route.count({
                where: {
                    ...base,
                    status: { in: [client_1.RouteStatus.ASSIGNED, client_1.RouteStatus.IN_PROGRESS] },
                },
            }),
            this.prisma.route.count({
                where: { ...base, plannedDate },
            }),
            this.prisma.route.count({
                where: {
                    ...base,
                    plannedDate,
                    status: client_1.RouteStatus.COMPLETED,
                },
            }),
        ]);
        return { active, plannedToday, completedToday };
    }
    async loadRoutesForMetrics(user, plannedDate) {
        return this.prisma.route.findMany({
            where: this.orgScope.forOrganization(user, { plannedDate }),
            include: { vehicle: true },
        });
    }
    computeRouteAggregates(routes) {
        const completed = routes.filter((r) => r.status === client_1.RouteStatus.COMPLETED &&
            r.totalDurationSeconds != null);
        const averageRouteDurationSeconds = completed.length > 0
            ? Math.round(completed.reduce((sum, r) => sum + (r.totalDurationSeconds ?? 0), 0) /
                completed.length)
            : null;
        const totalEstimatedDistanceMeters = routes.reduce((sum, r) => sum + (r.totalDistanceMeters ?? 0), 0);
        const withCapacity = routes.filter((r) => r.capacityUsedKg != null && r.vehicle != null);
        let capacityUtilizationPercent = null;
        if (withCapacity.length > 0) {
            const utilizations = withCapacity.map((r) => {
                const used = (0, decimal_util_1.decimalToNumber)(r.capacityUsedKg);
                const max = (0, decimal_util_1.decimalToNumber)(r.vehicle.maxWeightKg);
                return max > 0 ? (used / max) * 100 : 0;
            });
            capacityUtilizationPercent = Math.round(utilizations.reduce((a, b) => a + b, 0) / utilizations.length);
        }
        return {
            averageRouteDurationSeconds,
            totalEstimatedDistanceMeters,
            capacityUtilizationPercent,
        };
    }
    async countDelayedDeliveries(user, now) {
        const rows = await this.findDelayedDeliveryRows(user, now);
        return rows.length;
    }
    async findDelayedDeliveryRows(user, now) {
        const orgWhere = this.orgScope.forOrganization(user);
        const atRiskThreshold = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const deliveries = await this.prisma.delivery.findMany({
            where: {
                ...orgWhere,
                status: {
                    in: [
                        client_1.DeliveryStatus.PENDING,
                        client_1.DeliveryStatus.ASSIGNED,
                        client_1.DeliveryStatus.IN_PROGRESS,
                    ],
                },
                OR: [
                    { deadline: { lt: now } },
                    { deadline: { lte: atRiskThreshold, gte: now } },
                ],
            },
            select: {
                id: true,
                customerName: true,
                address: true,
                status: true,
                deadline: true,
            },
            take: 50,
            orderBy: { deadline: 'asc' },
        });
        const overdueStops = await this.prisma.routeStop.findMany({
            where: {
                status: { in: [client_1.RouteStopStatus.PENDING, client_1.RouteStopStatus.IN_PROGRESS] },
                estimatedArrival: { lt: now },
                route: {
                    ...orgWhere,
                    status: client_1.RouteStatus.IN_PROGRESS,
                },
            },
            include: {
                delivery: {
                    select: {
                        id: true,
                        customerName: true,
                        address: true,
                        status: true,
                        deadline: true,
                    },
                },
            },
            take: 50,
        });
        const delayed = [];
        const seen = new Set();
        for (const d of deliveries) {
            if (seen.has(d.id))
                continue;
            seen.add(d.id);
            const past = d.deadline && d.deadline < now;
            delayed.push({
                id: d.id,
                customerName: d.customerName,
                address: d.address,
                status: d.status,
                deadline: d.deadline,
                reason: past
                    ? 'Deadline er passert'
                    : 'Deadline innen 2 timer',
            });
        }
        for (const stop of overdueStops) {
            const d = stop.delivery;
            if (seen.has(d.id))
                continue;
            seen.add(d.id);
            delayed.push({
                id: d.id,
                customerName: d.customerName,
                address: d.address,
                status: d.status,
                deadline: d.deadline,
                reason: 'Estimert ankomst er passert',
            });
        }
        return delayed;
    }
    isStopDelayed(stop, now, routeStatus) {
        if (routeStatus !== client_1.RouteStatus.IN_PROGRESS) {
            return false;
        }
        if (stop.status !== client_1.RouteStopStatus.PENDING &&
            stop.status !== client_1.RouteStopStatus.IN_PROGRESS) {
            return false;
        }
        return stop.estimatedArrival != null && stop.estimatedArrival < now;
    }
    async buildAlerts(user, plannedDate, now) {
        const alerts = [];
        const orgWhere = this.orgScope.forOrganization(user);
        const atRiskThreshold = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const deadlineAtRisk = await this.prisma.delivery.findMany({
            where: {
                ...orgWhere,
                status: {
                    in: [
                        client_1.DeliveryStatus.PENDING,
                        client_1.DeliveryStatus.ASSIGNED,
                        client_1.DeliveryStatus.IN_PROGRESS,
                    ],
                },
                deadline: { lte: atRiskThreshold },
            },
            select: { id: true, customerName: true, deadline: true },
            take: 20,
            orderBy: { deadline: 'asc' },
        });
        for (const d of deadlineAtRisk) {
            const past = d.deadline && d.deadline < now;
            alerts.push({
                type: 'DEADLINE_AT_RISK',
                severity: past ? 'error' : 'warning',
                message: past
                    ? `${d.customerName}: deadline er passert`
                    : `${d.customerName}: deadline nærmer seg`,
                deliveryId: d.id,
            });
        }
        const routesWithCapacity = await this.prisma.route.findMany({
            where: {
                ...orgWhere,
                plannedDate,
                capacityUsedKg: { not: null },
                vehicleId: { not: null },
            },
            include: { vehicle: true },
            take: 30,
        });
        for (const route of routesWithCapacity) {
            if (!route.vehicle || route.capacityUsedKg == null)
                continue;
            const used = (0, decimal_util_1.decimalToNumber)(route.capacityUsedKg);
            const max = (0, decimal_util_1.decimalToNumber)(route.vehicle.maxWeightKg);
            if (used > max) {
                alerts.push({
                    type: 'OVER_CAPACITY',
                    severity: 'error',
                    message: `Rute ${route.id.slice(-6)}: ${route.vehicle.name} over max vekt (${used.toFixed(0)} / ${max.toFixed(0)} kg)`,
                    routeId: route.id,
                });
            }
        }
        const routesWithoutDriver = await this.prisma.route.count({
            where: {
                ...orgWhere,
                plannedDate,
                driverId: null,
                status: {
                    in: [client_1.RouteStatus.PLANNED, client_1.RouteStatus.ASSIGNED],
                },
            },
        });
        if (routesWithoutDriver > 0) {
            alerts.push({
                type: 'NO_DRIVER',
                severity: 'warning',
                message: `${routesWithoutDriver} rute(r) mangler tildelt sjåfør`,
            });
        }
        const pendingCount = await this.prisma.delivery.count({
            where: { ...orgWhere, status: client_1.DeliveryStatus.PENDING },
        });
        const availableDrivers = await this.prisma.driver.count({
            where: {
                ...orgWhere,
                status: client_1.DriverStatus.AVAILABLE,
            },
        });
        if (pendingCount > 0 && availableDrivers === 0) {
            alerts.push({
                type: 'NO_DRIVER',
                severity: 'warning',
                message: 'Ingen tilgjengelige sjåfører for nye tildelinger',
            });
        }
        const failedDeliveries = await this.prisma.delivery.findMany({
            where: { ...orgWhere, status: client_1.DeliveryStatus.FAILED },
            select: { id: true, customerName: true },
            take: 20,
            orderBy: { updatedAt: 'desc' },
        });
        for (const d of failedDeliveries) {
            alerts.push({
                type: 'FAILED_DELIVERY',
                severity: 'error',
                message: `${d.customerName}: levering mislyktes — krever oppfølging`,
                deliveryId: d.id,
            });
        }
        return alerts;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map