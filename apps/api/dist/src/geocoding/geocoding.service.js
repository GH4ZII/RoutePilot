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
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GeocodingService = class GeocodingService {
    config;
    constructor(config) {
        this.config = config;
    }
    async geocode(address) {
        const results = await this.searchNominatim(address, 1);
        if (!results.length) {
            throw new common_1.BadRequestException('Fant ikke adressen. Skriv gate, postnummer og sted (f.eks. Markens gate 10, 4610 Kristiansand).');
        }
        return this.toLocation(results[0]);
    }
    async suggest(query) {
        const trimmed = query.trim();
        if (trimmed.length < 3) {
            return [];
        }
        const results = await this.searchNominatim(trimmed, 6);
        return results.map((hit) => this.toLocation(hit));
    }
    async searchNominatim(query, limit) {
        const trimmed = query.trim();
        if (trimmed.length < 3) {
            throw new common_1.BadRequestException('Adressen er for kort');
        }
        const params = new URLSearchParams({
            q: trimmed,
            format: 'json',
            limit: String(limit),
            countrycodes: 'no',
            addressdetails: '0',
        });
        const userAgent = this.config.get('GEOCODING_USER_AGENT') ??
            'RoutePilot/1.0 (logistics-app)';
        let response;
        try {
            response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
                headers: {
                    'User-Agent': userAgent,
                    'Accept-Language': 'nb,no,en',
                },
            });
        }
        catch {
            throw new common_1.ServiceUnavailableException('Kunne ikke kontakte adressetjenesten. Prøv igjen.');
        }
        if (!response.ok) {
            throw new common_1.ServiceUnavailableException('Adressetjenesten svarte med en feil. Prøv igjen.');
        }
        return (await response.json());
    }
    toLocation(hit) {
        const latitude = Number(hit.lat);
        const longitude = Number(hit.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            throw new common_1.BadRequestException('Ugyldig svar fra adressetjenesten');
        }
        return {
            latitude,
            longitude,
            displayName: hit.display_name,
        };
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map