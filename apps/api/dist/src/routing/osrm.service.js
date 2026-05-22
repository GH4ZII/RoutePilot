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
exports.OsrmService = exports.OSRM_MAX_POINTS = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
exports.OSRM_MAX_POINTS = 100;
let OsrmService = class OsrmService {
    config;
    baseUrl;
    profile;
    constructor(config) {
        this.config = config;
        const configured = this.config.get('OSRM_BASE_URL')?.trim();
        this.baseUrl = (configured ?? 'https://router.project-osrm.org').replace(/\/$/, '');
        this.profile = this.config.get('OSRM_PROFILE')?.trim() || 'driving';
    }
    async getTable(points) {
        if (points.length < 2) {
            throw new common_1.BadRequestException('Minst to punkter kreves for matrise');
        }
        if (points.length > exports.OSRM_MAX_POINTS) {
            throw new common_1.BadRequestException(`Maks ${exports.OSRM_MAX_POINTS} punkter per matrise (OSRM-grense)`);
        }
        const coordinatePath = points
            .map((p) => `${p.longitude},${p.latitude}`)
            .join(';');
        const params = new URLSearchParams({
            annotations: 'duration,distance',
        });
        const url = `${this.baseUrl}/table/v1/${this.profile}/${coordinatePath}?${params}`;
        let response;
        try {
            response = await fetch(url, { headers: { Accept: 'application/json' } });
        }
        catch {
            throw new common_1.ServiceUnavailableException('Kunne ikke kontakte OSRM. Sjekk OSRM_BASE_URL eller nettverk.');
        }
        if (!response.ok) {
            throw new common_1.ServiceUnavailableException(`OSRM svarte med HTTP ${response.status}. Prøv igjen senere.`);
        }
        const body = (await response.json());
        if (body.code !== 'Ok' || !body.distances || !body.durations) {
            throw new common_1.ServiceUnavailableException(body.message ?? `OSRM returnerte kode: ${body.code}`);
        }
        return {
            distancesMeters: body.distances.map((row) => row.map((value) => this.normalizeMatrixCell(value, 'meter'))),
            durationsSeconds: body.durations.map((row) => row.map((value) => this.normalizeMatrixCell(value, 'sekund'))),
        };
    }
    normalizeMatrixCell(value, unit) {
        if (value === null || !Number.isFinite(value)) {
            throw new common_1.ServiceUnavailableException(`OSRM fant ingen kjørbare rute mellom to punkter (${unit})`);
        }
        return Math.round(value * 10) / 10;
    }
};
exports.OsrmService = OsrmService;
exports.OsrmService = OsrmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OsrmService);
//# sourceMappingURL=osrm.service.js.map