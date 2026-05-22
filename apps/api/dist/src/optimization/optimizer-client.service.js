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
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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
};
exports.OptimizerClientService = OptimizerClientService;
exports.OptimizerClientService = OptimizerClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OptimizerClientService);
//# sourceMappingURL=optimizer-client.service.js.map