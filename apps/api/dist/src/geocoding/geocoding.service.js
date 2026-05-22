"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
const KARTVERKET_BASE = 'https://ws.geonorge.no/adresser/v1';
let GeocodingService = class GeocodingService {
    async geocode(address) {
        let results = await this.searchKartverket(address, 1, false);
        if (!results.length) {
            results = await this.searchKartverket(address, 1, true);
        }
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
        const results = await this.searchKartverket(trimmed, 8, true);
        return results.map((hit) => this.toLocation(hit));
    }
    async searchKartverket(query, limit, fuzzy) {
        const trimmed = query.trim();
        if (trimmed.length < 3) {
            throw new common_1.BadRequestException('Adressen er for kort');
        }
        const params = new URLSearchParams({
            sok: trimmed,
            treffPerSide: String(Math.min(limit, 10)),
        });
        if (fuzzy) {
            params.set('fuzzy', 'true');
        }
        let response;
        try {
            response = await fetch(`${KARTVERKET_BASE}/sok?${params}`, {
                headers: { Accept: 'application/json' },
            });
        }
        catch {
            throw new common_1.ServiceUnavailableException('Kunne ikke kontakte Kartverkets adressetjeneste. Prøv igjen.');
        }
        if (!response.ok) {
            throw new common_1.ServiceUnavailableException('Kartverkets adressetjeneste svarte med en feil. Prøv igjen.');
        }
        const body = (await response.json());
        return (body.adresser ?? []).filter((addr) => addr.representasjonspunkt);
    }
    toLocation(addr) {
        const point = addr.representasjonspunkt;
        if (!point) {
            throw new common_1.BadRequestException('Adressen mangler koordinater');
        }
        const latitude = Number(point.lat);
        const longitude = Number(point.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            throw new common_1.BadRequestException('Ugyldig svar fra adressetjenesten');
        }
        return {
            latitude,
            longitude,
            displayName: this.formatDisplayName(addr),
        };
    }
    formatDisplayName(addr) {
        const line = addr.adressetekst?.trim();
        if (!line) {
            return '';
        }
        if (!addr.postnummer) {
            return line;
        }
        const place = this.formatPlaceName(addr.poststed ?? addr.kommunenavn);
        return place ? `${line}, ${addr.postnummer} ${place}` : `${line}, ${addr.postnummer}`;
    }
    formatPlaceName(raw) {
        if (!raw?.trim()) {
            return '';
        }
        const normalized = raw.trim().replace(/\s+S$/i, '').toLowerCase();
        return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = __decorate([
    (0, common_1.Injectable)()
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map