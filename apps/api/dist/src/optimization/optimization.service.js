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
const optimization_vrp_util_1 = require("./optimization-vrp.util");
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
            const result = await this.executeVrpOptimization(organizationId, request);
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
    async executeVrpOptimization(organizationId, request) {
        const vehicles = await this.loadAvailableVehicles(organizationId, request.vehicleIds);
        const drivers = await this.resolveDrivers(organizationId, request.vehicleIds, request.driverIds);
        const deliveries = await this.loadPendingDeliveries(organizationId, request.deliveryIds);
        const routeStart = (0, optimization_vrp_util_1.parseRouteStart)(request.plannedDate, request.routeStartTime);
        const returnToDepot = request.returnToDepot !== false;
        const { points, vehicleDepots } = this.buildMatrixPoints(vehicles, deliveries, returnToDepot);
        const matrix = await this.routing.buildDistanceTimeMatrix(points);
        const vrpDeliveries = deliveries.map((d, i) => ({
            node_index: i,
            delivery_index: i,
            weight_units: (0, optimization_vrp_util_1.weightToUnits)(Number(d.weightKg)),
            volume_units: (0, optimization_vrp_util_1.volumeToUnits)(d.volumeM3 != null ? Number(d.volumeM3) : null),
            package_count: 1,
            time_window_start_sec: (0, optimization_vrp_util_1.secondsFromRouteStart)(routeStart, d.timeWindowStart),
            time_window_end_sec: (0, optimization_vrp_util_1.secondsFromRouteStart)(routeStart, d.timeWindowEnd),
            deadline_sec: (0, optimization_vrp_util_1.secondsFromRouteStart)(routeStart, d.deadline),
            priority: d.priority,
            drop_penalty: (0, optimization_vrp_util_1.dropPenaltyForPriority)(d.priority),
        }));
        const vrpVehicles = vehicleDepots.map((depot, vehicleIndex) => {
            const v = vehicles[vehicleIndex];
            const maxWeight = request.respectCapacity
                ? (0, optimization_vrp_util_1.weightToUnits)((0, decimal_util_1.decimalToNumber)(v.maxWeightKg) ?? 0)
                : 1_000_000_000;
            const maxVolume = request.respectCapacity
                ? (0, optimization_vrp_util_1.volumeToUnits)((0, decimal_util_1.decimalToNumber)(v.maxVolumeM3))
                : 1_000_000_000;
            const maxPackages = request.respectCapacity ? 10_000 : 10_000;
            return {
                start_index: depot.startIndex,
                end_index: depot.endIndex,
                max_weight_units: maxWeight,
                max_volume_units: maxVolume,
                max_packages: maxPackages,
            };
        });
        const vrpResult = await this.optimizer.solveVrp({
            duration_matrix: matrix.durationsSeconds,
            distance_matrix: matrix.distancesMeters,
            vehicles: vrpVehicles,
            deliveries: vrpDeliveries,
            objective: request.objective,
            respect_capacity: request.respectCapacity,
            respect_time_windows: request.respectTimeWindows,
            service_time_sec: optimization_vrp_util_1.SERVICE_TIME_SEC,
            horizon_sec: optimization_vrp_util_1.HORIZON_SEC,
        });
        const warnings = [];
        const unassignedDeliveryIds = vrpResult.unassignedDeliveryIndices.map((idx) => deliveries[idx].id);
        if (unassignedDeliveryIds.length > 0) {
            warnings.push(`${unassignedDeliveryIds.length} levering(er) kunne ikke tildeles (kapasitet, tidsvindu eller manglende sjåfør/kjøretøy).`);
        }
        const routeResults = [];
        await this.prisma.$transaction(async (tx) => {
            for (const vrpRoute of vrpResult.routes) {
                const vehicleIndex = vrpRoute.vehicleIndex;
                const vehicle = vehicles[vehicleIndex];
                const driverId = drivers[vehicleIndex] ?? null;
                const visitIndices = (0, optimization_vrp_util_1.extractDeliveryVisitOrder)(vrpRoute.routeIndices, points);
                if (visitIndices.length === 0) {
                    continue;
                }
                const { totalDistanceMeters, totalDurationSeconds, stopEtas } = (0, optimization_vrp_util_1.computeLegMetrics)(vrpRoute.routeIndices, matrix, routeStart);
                const assignedDeliveries = visitIndices
                    .map((idx) => points[idx])
                    .filter((p) => p.kind === 'delivery' && p.deliveryIndex != null);
                const capacityUsedKg = assignedDeliveries.reduce((sum, p) => {
                    const d = deliveries[p.deliveryIndex];
                    return sum + Number(d.weightKg);
                }, 0);
                const createdRoute = await tx.route.create({
                    data: {
                        organizationId,
                        vehicleId: vehicle.id,
                        driverId,
                        status: client_1.RouteStatus.PLANNED,
                        plannedDate: new Date(`${request.plannedDate}T12:00:00.000Z`),
                        totalDistanceMeters,
                        totalDurationSeconds,
                        capacityUsedKg,
                    },
                });
                let stopOrder = 1;
                const stops = [];
                for (const pointIndex of visitIndices) {
                    const point = points[pointIndex];
                    if (point.kind !== 'delivery' || point.deliveryIndex == null) {
                        continue;
                    }
                    const delivery = deliveries[point.deliveryIndex];
                    const eta = stopEtas.get(pointIndex) ?? null;
                    await tx.routeStop.create({
                        data: {
                            routeId: createdRoute.id,
                            deliveryId: delivery.id,
                            stopOrder,
                            estimatedArrival: eta,
                            status: client_1.RouteStopStatus.PENDING,
                        },
                    });
                    await tx.delivery.update({
                        where: { id: delivery.id },
                        data: { status: client_1.DeliveryStatus.ASSIGNED },
                    });
                    this.collectTimingWarnings(delivery, eta, routeStart, warnings);
                    stops.push({
                        deliveryId: delivery.id,
                        order: stopOrder,
                        estimatedArrival: eta?.toISOString() ?? null,
                    });
                    stopOrder += 1;
                }
                routeResults.push({
                    routeId: createdRoute.id,
                    driverId,
                    vehicleId: vehicle.id,
                    totalDistanceMeters,
                    totalDurationSeconds,
                    optimizerCost: vrpRoute.totalCost,
                    capacityUsedKg,
                    stops,
                });
            }
        });
        if (routeResults.length === 0 && deliveries.length > 0) {
            throw new common_1.BadRequestException('Optimalisering opprettet ingen ruter — sjekk kapasitet, tidsvinduer og tilgjengelige kjøretøy');
        }
        return {
            routes: routeResults,
            unassignedDeliveries: unassignedDeliveryIds,
            warnings,
        };
    }
    collectTimingWarnings(delivery, eta, routeStart, warnings) {
        if (!eta) {
            return;
        }
        if (delivery.deadline && eta > delivery.deadline) {
            warnings.push(`Levering ${delivery.id}: estimert ankomst etter deadline.`);
        }
        if (delivery.timeWindowEnd &&
            eta > delivery.timeWindowEnd) {
            warnings.push(`Levering ${delivery.id}: estimert ankomst utenfor tidsvindu.`);
        }
        if (delivery.timeWindowStart &&
            eta < delivery.timeWindowStart &&
            (0, optimization_vrp_util_1.secondsFromRouteStart)(routeStart, delivery.timeWindowStart) != null) {
            warnings.push(`Levering ${delivery.id}: estimert ankomst før tidsvindu åpner.`);
        }
    }
    buildMatrixPoints(vehicles, deliveries, returnToDepot) {
        const points = deliveries.map((d, i) => ({
            id: d.id,
            kind: 'delivery',
            deliveryIndex: i,
            latitude: (0, decimal_util_1.decimalToNumber)(d.latitude),
            longitude: (0, decimal_util_1.decimalToNumber)(d.longitude),
        }));
        const vehicleDepots = [];
        for (let v = 0; v < vehicles.length; v += 1) {
            const vehicle = vehicles[v];
            const startLat = (0, decimal_util_1.decimalToNumber)(vehicle.startLatitude);
            const startLon = (0, decimal_util_1.decimalToNumber)(vehicle.startLongitude);
            const endLat = (0, decimal_util_1.decimalToNumber)(vehicle.endLatitude);
            const endLon = (0, decimal_util_1.decimalToNumber)(vehicle.endLongitude);
            const startIndex = points.length;
            points.push({
                id: `depot-start-${vehicle.id}`,
                kind: 'depot-start',
                vehicleIndex: v,
                latitude: startLat,
                longitude: startLon,
            });
            let endIndex = startIndex;
            const endDiffers = Math.abs(startLat - endLat) > 1e-6 ||
                Math.abs(startLon - endLon) > 1e-6;
            if (returnToDepot && endDiffers) {
                endIndex = points.length;
                points.push({
                    id: `depot-end-${vehicle.id}`,
                    kind: 'depot-end',
                    vehicleIndex: v,
                    latitude: endLat,
                    longitude: endLon,
                });
            }
            vehicleDepots.push({ startIndex, endIndex });
        }
        return { points, vehicleDepots };
    }
    async loadAvailableVehicles(organizationId, vehicleIds) {
        const vehicles = await this.prisma.vehicle.findMany({
            where: { organizationId, id: { in: vehicleIds } },
        });
        if (vehicles.length !== vehicleIds.length) {
            throw new common_1.BadRequestException('En eller flere kjøretøy ble ikke funnet');
        }
        const unavailable = vehicles.filter((v) => v.status !== client_1.VehicleStatus.AVAILABLE);
        if (unavailable.length > 0) {
            throw new common_1.BadRequestException(`Kun tilgjengelige kjøretøy kan brukes. Utilgjengelig: ${unavailable.map((v) => v.name).join(', ')}`);
        }
        const order = new Map(vehicleIds.map((id, i) => [id, i]));
        return [...vehicles].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    }
    async resolveDrivers(organizationId, vehicleIds, driverIds) {
        const result = vehicleIds.map(() => null);
        if (!driverIds?.length) {
            return result;
        }
        if (driverIds.length > vehicleIds.length) {
            throw new common_1.BadRequestException('driverIds kan ikke være flere enn vehicleIds');
        }
        const uniqueDriverIds = [...new Set(driverIds)];
        const drivers = await this.prisma.driver.findMany({
            where: { organizationId, id: { in: uniqueDriverIds } },
        });
        if (drivers.length !== uniqueDriverIds.length) {
            throw new common_1.BadRequestException('En eller flere sjåfører ble ikke funnet');
        }
        const unavailable = drivers.filter((d) => d.status !== client_1.DriverStatus.AVAILABLE);
        if (unavailable.length > 0) {
            throw new common_1.BadRequestException(`Kun tilgjengelige sjåfører kan tildeles. Utilgjengelig: ${unavailable.map((d) => d.name).join(', ')}`);
        }
        const usedDrivers = new Set();
        for (let i = 0; i < driverIds.length; i += 1) {
            const id = driverIds[i];
            if (!id) {
                continue;
            }
            if (usedDrivers.has(id)) {
                throw new common_1.BadRequestException('Samme sjåfør kan ikke tildeles flere kjøretøy i én jobb');
            }
            usedDrivers.add(id);
            result[i] = id;
        }
        return result;
    }
    async loadPendingDeliveries(organizationId, deliveryIds) {
        const deliveries = await this.prisma.delivery.findMany({
            where: { organizationId, id: { in: deliveryIds } },
        });
        if (deliveries.length !== deliveryIds.length) {
            throw new common_1.BadRequestException('En eller flere leveringer ble ikke funnet');
        }
        const notPending = deliveries.filter((d) => d.status !== client_1.DeliveryStatus.PENDING);
        if (notPending.length > 0) {
            throw new common_1.BadRequestException('Alle leveringer må ha status PENDING for optimalisering');
        }
        const order = new Map(deliveryIds.map((id, i) => [id, i]));
        return [...deliveries].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    }
    async validateCreateRequest(organizationId, dto) {
        const vehicleIds = dto.vehicleIds?.length
            ? [...new Set(dto.vehicleIds)]
            : dto.vehicleId
                ? [dto.vehicleId]
                : [];
        if (vehicleIds.length === 0) {
            throw new common_1.BadRequestException('Angi vehicleId eller vehicleIds');
        }
        await this.loadAvailableVehicles(organizationId, vehicleIds);
        if (dto.driverIds?.length) {
            await this.resolveDrivers(organizationId, vehicleIds, dto.driverIds);
        }
        const uniqueDeliveryIds = [...new Set(dto.deliveryIds)];
        if (uniqueDeliveryIds.length !== dto.deliveryIds.length) {
            throw new common_1.BadRequestException('Duplikate deliveryIds');
        }
        return {
            plannedDate: dto.plannedDate,
            vehicleIds,
            driverIds: dto.driverIds,
            deliveryIds: uniqueDeliveryIds,
            objective: dto.objective ?? client_1.OptimizationObjective.MINIMIZE_TOTAL_TIME,
            routeStartTime: dto.routeStartTime ?? '08:00',
            returnToDepot: dto.returnToDepot !== false,
            respectCapacity: dto.respectCapacity !== false,
            respectTimeWindows: dto.respectTimeWindows !== false,
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