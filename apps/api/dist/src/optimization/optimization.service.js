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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationService = exports.OPTIMIZATION_QUEUE = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const client_1 = require("../generated/prisma/client");
const decimal_util_1 = require("../common/decimal.util");
const org_scope_service_1 = require("../common/org-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
const routing_service_1 = require("../routing/routing.service");
const optimizer_client_service_1 = require("./optimizer-client.service");
exports.OPTIMIZATION_QUEUE = 'optimization';
let OptimizationService = class OptimizationService {
    prisma;
    orgScope;
    routing;
    optimizer;
    queue;
    constructor(prisma, orgScope, routing, optimizer, queue) {
        this.prisma = prisma;
        this.orgScope = orgScope;
        this.routing = routing;
        this.optimizer = optimizer;
        this.queue = queue;
    }
    async createJob(user, dto) {
        const organizationId = this.orgScope.requireOrganizationId(user);
        const request = await this.validateCreateRequest(organizationId, dto);
        const job = await this.prisma.optimizationJob.create({
            data: {
                organizationId,
                status: client_1.OptimizationJobStatus.PENDING,
                objective: request.objective,
                plannedDate: new Date(`${request.plannedDate}T12:00:00.000Z`),
                request: request,
            },
        });
        await this.queue.add('run', { jobId: job.id, organizationId }, { jobId: job.id, removeOnComplete: 100, removeOnFail: 50 });
        return this.toJobResponse(job);
    }
    async findJob(user, id) {
        const job = await this.prisma.optimizationJob.findFirst({
            where: this.orgScope.forOrganization(user, { id }),
        });
        if (!job) {
            throw new common_1.NotFoundException('Optimaliseringsjobb ikke funnet');
        }
        return this.toJobResponse(job);
    }
    async runJob(jobId, organizationId) {
        const job = await this.prisma.optimizationJob.findFirst({
            where: { id: jobId, organizationId },
        });
        if (!job) {
            return;
        }
        if (job.status === client_1.OptimizationJobStatus.COMPLETED ||
            job.status === client_1.OptimizationJobStatus.FAILED) {
            return;
        }
        await this.prisma.optimizationJob.update({
            where: { id: jobId },
            data: {
                status: client_1.OptimizationJobStatus.RUNNING,
                startedAt: new Date(),
                errorMessage: null,
            },
        });
        try {
            const request = job.request;
            const result = await this.executeOptimization(organizationId, request);
            await this.prisma.optimizationJob.update({
                where: { id: jobId },
                data: {
                    status: client_1.OptimizationJobStatus.COMPLETED,
                    result: result,
                    completedAt: new Date(),
                },
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Optimalisering feilet';
            await this.prisma.optimizationJob.update({
                where: { id: jobId },
                data: {
                    status: client_1.OptimizationJobStatus.FAILED,
                    errorMessage: message,
                    completedAt: new Date(),
                },
            });
        }
    }
    async executeOptimization(organizationId, request) {
        const vehicle = await this.prisma.vehicle.findFirst({
            where: { id: request.vehicleId, organizationId },
        });
        if (!vehicle) {
            throw new common_1.BadRequestException('Kjøretøy ikke funnet');
        }
        if (request.driverId) {
            const driver = await this.prisma.driver.findFirst({
                where: { id: request.driverId, organizationId },
            });
            if (!driver) {
                throw new common_1.BadRequestException('Sjåfør ikke funnet');
            }
        }
        const deliveries = await this.prisma.delivery.findMany({
            where: {
                organizationId,
                id: { in: request.deliveryIds },
            },
        });
        if (deliveries.length !== request.deliveryIds.length) {
            throw new common_1.BadRequestException('En eller flere leveringer ble ikke funnet');
        }
        const notPending = deliveries.filter((d) => d.status !== client_1.DeliveryStatus.PENDING);
        if (notPending.length > 0) {
            throw new common_1.BadRequestException('Alle leveringer må ha status PENDING for optimalisering');
        }
        const startLat = (0, decimal_util_1.decimalToNumber)(vehicle.startLatitude);
        const startLon = (0, decimal_util_1.decimalToNumber)(vehicle.startLongitude);
        const endLat = (0, decimal_util_1.decimalToNumber)(vehicle.endLatitude);
        const endLon = (0, decimal_util_1.decimalToNumber)(vehicle.endLongitude);
        const points = [
            {
                id: 'depot-start',
                kind: 'depot-start',
                latitude: startLat,
                longitude: startLon,
            },
            ...deliveries.map((d) => ({
                id: d.id,
                kind: 'delivery',
                deliveryId: d.id,
                latitude: (0, decimal_util_1.decimalToNumber)(d.latitude),
                longitude: (0, decimal_util_1.decimalToNumber)(d.longitude),
            })),
        ];
        const returnToDepot = request.returnToDepot !== false;
        const endDiffers = Math.abs(startLat - endLat) > 1e-6 ||
            Math.abs(startLon - endLon) > 1e-6;
        if (returnToDepot && endDiffers) {
            points.push({
                id: 'depot-end',
                kind: 'depot-end',
                latitude: endLat,
                longitude: endLon,
            });
        }
        const matrix = await this.routing.buildDistanceTimeMatrix(points);
        const costMatrix = request.objective === client_1.OptimizationObjective.MINIMIZE_TOTAL_DISTANCE
            ? matrix.distancesMeters
            : matrix.durationsSeconds;
        const { routeIndices, totalCost } = await this.optimizer.solveTsp(costMatrix);
        const visitIndices = this.extractDeliveryVisitOrder(routeIndices, points);
        if (visitIndices.length === 0) {
            throw new common_1.BadRequestException('Optimalisering returnerte ingen leveringsstopp');
        }
        const { totalDistanceMeters, totalDurationSeconds, stopEtas } = this.computeLegMetrics(routeIndices, matrix, request);
        const route = await this.prisma.$transaction(async (tx) => {
            const createdRoute = await tx.route.create({
                data: {
                    organizationId,
                    vehicleId: vehicle.id,
                    driverId: request.driverId ?? null,
                    status: client_1.RouteStatus.PLANNED,
                    plannedDate: new Date(`${request.plannedDate}T12:00:00.000Z`),
                    totalDistanceMeters,
                    totalDurationSeconds,
                    capacityUsedKg: deliveries.reduce((sum, d) => sum + Number(d.weightKg), 0),
                },
            });
            let stopOrder = 1;
            for (const pointIndex of visitIndices) {
                const point = points[pointIndex];
                if (point.kind !== 'delivery' || !point.deliveryId) {
                    continue;
                }
                await tx.routeStop.create({
                    data: {
                        routeId: createdRoute.id,
                        deliveryId: point.deliveryId,
                        stopOrder,
                        estimatedArrival: stopEtas.get(pointIndex) ?? null,
                        status: client_1.RouteStopStatus.PENDING,
                    },
                });
                await tx.delivery.update({
                    where: { id: point.deliveryId },
                    data: { status: client_1.DeliveryStatus.ASSIGNED },
                });
                stopOrder += 1;
            }
            return createdRoute;
        });
        const orderedStops = [];
        let order = 1;
        for (const pointIndex of visitIndices) {
            const point = points[pointIndex];
            if (point.kind !== 'delivery' || !point.deliveryId) {
                continue;
            }
            orderedStops.push({
                deliveryId: point.deliveryId,
                order,
                estimatedArrival: stopEtas.get(pointIndex)?.toISOString() ?? null,
            });
            order += 1;
        }
        return {
            routes: [
                {
                    routeId: route.id,
                    driverId: request.driverId ?? null,
                    vehicleId: vehicle.id,
                    totalDistanceMeters,
                    totalDurationSeconds,
                    optimizerCost: totalCost,
                    stops: orderedStops,
                },
            ],
            unassignedDeliveries: [],
            warnings: [],
        };
    }
    extractDeliveryVisitOrder(routeIndices, points) {
        const seen = new Set();
        const order = [];
        for (const idx of routeIndices) {
            if (seen.has(idx)) {
                continue;
            }
            seen.add(idx);
            if (points[idx]?.kind === 'delivery') {
                order.push(idx);
            }
        }
        return order;
    }
    computeLegMetrics(routeIndices, matrix, request) {
        const startAt = this.parseRouteStart(request.plannedDate, request.routeStartTime);
        let totalDistanceMeters = 0;
        let totalDurationSeconds = 0;
        const stopEtas = new Map();
        let currentTime = startAt;
        for (let i = 0; i < routeIndices.length - 1; i += 1) {
            const from = routeIndices[i];
            const to = routeIndices[i + 1];
            const dist = matrix.distancesMeters[from]?.[to] ?? 0;
            const dur = matrix.durationsSeconds[from]?.[to] ?? 0;
            totalDistanceMeters += dist;
            totalDurationSeconds += dur;
            currentTime = new Date(currentTime.getTime() + dur * 1000);
            stopEtas.set(to, new Date(currentTime));
        }
        return { totalDistanceMeters, totalDurationSeconds, stopEtas };
    }
    parseRouteStart(plannedDate, routeStartTime) {
        const [hours, minutes] = routeStartTime.split(':').map(Number);
        const [year, month, day] = plannedDate.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    }
    async validateCreateRequest(organizationId, dto) {
        const vehicle = await this.prisma.vehicle.findFirst({
            where: { id: dto.vehicleId, organizationId },
        });
        if (!vehicle) {
            throw new common_1.BadRequestException('Kjøretøy ikke funnet');
        }
        if (dto.driverId) {
            const driver = await this.prisma.driver.findFirst({
                where: { id: dto.driverId, organizationId },
            });
            if (!driver) {
                throw new common_1.BadRequestException('Sjåfør ikke funnet');
            }
        }
        const uniqueIds = [...new Set(dto.deliveryIds)];
        if (uniqueIds.length !== dto.deliveryIds.length) {
            throw new common_1.BadRequestException('Duplikate deliveryIds');
        }
        return {
            plannedDate: dto.plannedDate,
            vehicleId: dto.vehicleId,
            driverId: dto.driverId,
            deliveryIds: uniqueIds,
            objective: dto.objective ?? client_1.OptimizationObjective.MINIMIZE_TOTAL_TIME,
            routeStartTime: dto.routeStartTime ?? '08:00',
            returnToDepot: dto.returnToDepot !== false,
        };
    }
    toJobResponse(job) {
        return {
            id: job.id,
            organizationId: job.organizationId,
            status: job.status,
            objective: job.objective,
            plannedDate: job.plannedDate.toISOString().slice(0, 10),
            request: job.request,
            result: job.result,
            errorMessage: job.errorMessage,
            startedAt: job.startedAt,
            completedAt: job.completedAt,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
        };
    }
};
exports.OptimizationService = OptimizationService;
exports.OptimizationService = OptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, bullmq_1.InjectQueue)(exports.OPTIMIZATION_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService,
        routing_service_1.RoutingService,
        optimizer_client_service_1.OptimizerClientService,
        bullmq_2.Queue])
], OptimizationService);
//# sourceMappingURL=optimization.service.js.map