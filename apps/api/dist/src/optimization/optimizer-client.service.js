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
exports.OptimizerClientService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let OptimizerClientService = class OptimizerClientService {
    config;
    baseUrl;
    constructor(config) {
        this.config = config;
        const configured = this.config.get('OPTIMIZER_URL')?.trim();
        this.baseUrl = (configured ?? 'http://localhost:8000').replace(/\/$/, '');
    }
    async solveTsp(durationMatrix) {
        let response;
        try {
            response = await fetch(`${this.baseUrl}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    duration_matrix: durationMatrix,
                    depot_index: 0,
                    cost_type: 'duration',
                }),
            });
        }
        catch {
            throw new common_1.ServiceUnavailableException('Kunne ikke kontakte optimaliseringstjenesten (Python/OR-Tools). Er den startet?');
        }
        if (!response.ok) {
            const detail = await response.text().catch(() => '');
            throw new common_1.ServiceUnavailableException(detail || `Optimaliseringstjenesten svarte med HTTP ${response.status}`);
        }
        const body = (await response.json());
        return {
            routeIndices: body.route_indices,
            totalCost: body.total_cost,
        };
    }
    async solveVrp(payload) {
        let response;
        try {
            response = await fetch(`${this.baseUrl}/solve-vrp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    duration_matrix: payload.duration_matrix,
                    distance_matrix: payload.distance_matrix,
                    vehicles: payload.vehicles.map((v) => ({
                        start_index: v.start_index,
                        end_index: v.end_index,
                        max_weight_units: v.max_weight_units,
                        max_volume_units: v.max_volume_units,
                        max_packages: v.max_packages,
                    })),
                    deliveries: payload.deliveries.map((d) => ({
                        node_index: d.node_index,
                        delivery_index: d.delivery_index,
                        weight_units: d.weight_units,
                        volume_units: d.volume_units,
                        package_count: d.package_count,
                        time_window_start_sec: d.time_window_start_sec,
                        time_window_end_sec: d.time_window_end_sec,
                        deadline_sec: d.deadline_sec,
                        priority: d.priority,
                        drop_penalty: d.drop_penalty,
                    })),
                    objective: payload.objective,
                    respect_capacity: payload.respect_capacity,
                    respect_time_windows: payload.respect_time_windows,
                    service_time_sec: payload.service_time_sec,
                    horizon_sec: payload.horizon_sec,
                }),
            });
        }
        catch {
            throw new common_1.ServiceUnavailableException('Kunne ikke kontakte optimaliseringstjenesten (Python/OR-Tools). Er den startet?');
        }
        if (!response.ok) {
            const detail = await response.text().catch(() => '');
            throw new common_1.ServiceUnavailableException(detail || `VRP-tjenesten svarte med HTTP ${response.status}`);
        }
        const body = (await response.json());
        return {
            routes: body.routes.map((r) => ({
                vehicleIndex: r.vehicle_index,
                routeIndices: r.route_indices,
                totalCost: r.total_cost,
            })),
            unassignedDeliveryIndices: body.unassigned_delivery_indices,
        };
    }
};
exports.OptimizerClientService = OptimizerClientService;
exports.OptimizerClientService = OptimizerClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OptimizerClientService);
//# sourceMappingURL=optimizer-client.service.js.map