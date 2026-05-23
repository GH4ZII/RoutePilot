import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  normalizeAddress,
  parseAddressQuery,
  placeMatches,
  type ParsedAddressQuery,
} from './geocoding.util';

export type GeocodedLocation = {
  latitude: number;
  longitude: number;
  displayName: string;
};

export type AddressSuggestion = GeocodedLocation;

type KartverketPoint = {
  lat: number;
  lon: number;
};

type KartverketAddress = {
  adressetekst: string;
  postnummer?: string;
  poststed?: string;
  kommunenavn?: string;
  representasjonspunkt?: KartverketPoint;
};

type KartverketSearchResponse = {
  adresser?: KartverketAddress[];
};

const KARTVERKET_BASE = 'https://ws.geonorge.no/adresser/v1';

@Injectable()
export class GeocodingService {
  async geocode(address: string): Promise<GeocodedLocation> {
    const results = await this.searchAddresses(address, 20);
    if (!results.length) {
      throw new BadRequestException(
        'Fant ikke adressen. Skriv gate, postnummer og sted (f.eks. Markens gate 10, 4610 Kristiansand).',
      );
    }
    return this.toLocation(results[0]);
  }

  async suggest(query: string): Promise<AddressSuggestion[]> {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      return [];
    }
    const results = await this.searchAddresses(trimmed, 8);
    return results.map((hit) => this.toLocation(hit));
  }

  private async searchAddresses(
    query: string,
    limit: number,
  ): Promise<KartverketAddress[]> {
    const parsed = parseAddressQuery(query);

    let results: KartverketAddress[] = [];
    if (parsed.adressenavn && parsed.nummer) {
      results = await this.searchStructured(
        parsed.adressenavn,
        parsed.nummer,
        Math.max(limit, 20),
      );
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

  private rankResults(
    results: KartverketAddress[],
    parsed: ParsedAddressQuery,
  ): KartverketAddress[] {
    if (!results.length) {
      return results;
    }

    let ranked = results;
    if (parsed.postnummer) {
      const withPostnummer = ranked.filter(
        (addr) => addr.postnummer === parsed.postnummer,
      );
      if (withPostnummer.length) {
        ranked = withPostnummer;
      }
    }

    if (parsed.place) {
      const withPlace = ranked.filter(
        (addr) =>
          placeMatches(addr.poststed, parsed.place!) ||
          placeMatches(addr.kommunenavn, parsed.place!),
      );
      if (withPlace.length) {
        ranked = withPlace;
      }
    }

    return ranked;
  }

  private async searchStructured(
    adressenavn: string,
    nummer: string,
    limit: number,
  ): Promise<KartverketAddress[]> {
    const params = new URLSearchParams({
      adressenavn,
      nummer,
      treffPerSide: String(Math.min(limit, 50)),
    });
    return this.fetchKartverket(`${KARTVERKET_BASE}/sok?${params}`);
  }

  private async searchKartverket(
    query: string,
    limit: number,
    fuzzy: boolean,
  ): Promise<KartverketAddress[]> {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      throw new BadRequestException('Adressen er for kort');
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

  private async fetchKartverket(url: string): Promise<KartverketAddress[]> {
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
    } catch {
      throw new ServiceUnavailableException(
        'Kunne ikke kontakte Kartverkets adressetjeneste. Prøv igjen.',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Kartverkets adressetjeneste svarte med en feil. Prøv igjen.',
      );
    }

    const body = (await response.json()) as KartverketSearchResponse;
    return (body.adresser ?? []).filter((addr) => addr.representasjonspunkt);
  }

  private toLocation(addr: KartverketAddress): GeocodedLocation {
    const point = addr.representasjonspunkt;
    if (!point) {
      throw new BadRequestException('Adressen mangler koordinater');
    }

    const latitude = Number(point.lat);
    const longitude = Number(point.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new BadRequestException('Ugyldig svar fra adressetjenesten');
    }

    return {
      latitude,
      longitude,
      displayName: this.formatDisplayName(addr),
    };
  }

  private formatDisplayName(addr: KartverketAddress): string {
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

  private formatPlaceName(raw?: string): string {
    if (!raw?.trim()) {
      return '';
    }
    const normalized = raw.trim().replace(/\s+S$/i, '').toLowerCase();
    return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
