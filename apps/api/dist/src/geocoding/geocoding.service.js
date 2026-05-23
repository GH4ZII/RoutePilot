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
const geocoding_util_1 = require("./geocoding.util");
const KARTVERKET_BASE = 'https://ws.geonorge.no/adresser/v1';
let GeocodingService = class GeocodingService {
    async geocode(address) {
        const results = await this.searchAddresses(address, 20);
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
        const results = await this.searchAddresses(trimmed, 8);
        return results.map((hit) => this.toLocation(hit));
    }
    async searchAddresses(query, limit) {
        const parsed = (0, geocoding_util_1.parseAddressQuery)(query);
        let results = [];
        if (parsed.adressenavn && parsed.nummer) {
            results = await this.searchStructured(parsed.adressenavn, parsed.nummer, Math.max(limit, 20));
            results = this.rankResults(results, parsed);
        }
        if (!results.length) {
            results = await this.searchKartverket(query, limit, false);
            results = this.rankResults(results, parsed);
        }
        if (!results.length) {
            results = await this.searchKartverket(query, limit, true);
            results = this.rankResults(results, parsed);
        }
        return results.slice(0, limit);
    }
    rankResults(results, parsed) {
        if (!results.length) {
            return results;
        }
        let ranked = results;
        if (parsed.postnummer) {
            const withPostnummer = ranked.filter((addr) => addr.postnummer === parsed.postnummer);
            if (withPostnummer.length) {
                ranked = withPostnummer;
            }
        }
        if (parsed.place) {
            const withPlace = ranked.filter((addr) => (0, geocoding_util_1.placeMatches)(addr.poststed, parsed.place) ||
                (0, geocoding_util_1.placeMatches)(addr.kommunenavn, parsed.place));
            if (withPlace.length) {
                ranked = withPlace;
            }
        }
        return ranked;
    }
    async searchStructured(adressenavn, nummer, limit) {
        const params = new URLSearchParams({
            adressenavn,
            nummer,
            treffPerSide: String(Math.min(limit, 50)),
        });
        return this.fetchKartverket(`${KARTVERKET_BASE}/sok?${params}`);
    }
    async searchKartverket(query, limit, fuzzy) {
        const trimmed = query.trim();
        if (trimmed.length < 3) {
            throw new common_1.BadRequestException('Adressen er for kort');
        }
        const params = new URLSearchParams({
            sok: trimmed,
            treffPerSide: String(Math.min(limit, 50)),
        });
        if (fuzzy) {
            params.set('fuzzy', 'true');
        }
        return this.fetchKartverket(`${KARTVERKET_BASE}/sok?${params}`);
    }
    async fetchKartverket(url) {
        let response;
        try {
            response = await fetch(url, {
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