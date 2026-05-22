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
exports.RoutingService = void 0;
const common_1 = require("@nestjs/common");
const osrm_service_1 = require("./osrm.service");
let RoutingService = class RoutingService {
    osrm;
    constructor(osrm) {
        this.osrm = osrm;
    }
    async buildDistanceTimeMatrix(points) {
        const validated = this.validatePoints(points);
        const table = await this.osrm.getTable(validated);
        return {
            pointIds: validated.map((p) => p.id),
            distancesMeters: table.distancesMeters,
            durationsSeconds: table.durationsSeconds,
        };
    }
    validatePoints(points) {
        if (points.length < 2) {
            throw new common_1.BadRequestException('Minst to punkter kreves');
        }
        const seen = new Set();
        const validated = [];
        for (const point of points) {
            const id = point.id?.trim();
            if (!id) {
                throw new common_1.BadRequestException('Hvert punkt må ha en id');
            }
            if (seen.has(id)) {
                throw new common_1.BadRequestException(`Duplikat id: ${id}`);
            }
            seen.add(id);
            const latitude = Number(point.latitude);
            const longitude = Number(point.longitude);
            if (!Number.isFinite(latitude) ||
                latitude < -90 ||
                latitude > 90 ||
                !Number.isFinite(longitude) ||
                longitude < -180 ||
                longitude > 180) {
                throw new common_1.BadRequestException(`Ugyldige koordinater for punkt "${id}"`);
            }
            validated.push({ id, latitude, longitude });
        }
        return validated;
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [osrm_service_1.OsrmService])
], RoutingService);
//# sourceMappingURL=routing.service.js.map