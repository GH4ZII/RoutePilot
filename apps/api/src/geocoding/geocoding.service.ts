import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type GeocodedLocation = {
  latitude: number;
  longitude: number;
  displayName: string;
};

export type AddressSuggestion = GeocodedLocation;

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

@Injectable()
export class GeocodingService {
  constructor(private readonly config: ConfigService) {}

  async geocode(address: string): Promise<GeocodedLocation> {
    const results = await this.searchNominatim(address, 1);
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
    const results = await this.searchNominatim(trimmed, 6);
    return results.map((hit) => this.toLocation(hit));
  }

  private async searchNominatim(
    query: string,
    limit: number,
  ): Promise<NominatimResult[]> {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      throw new BadRequestException('Adressen er for kort');
    }

    const params = new URLSearchParams({
      q: trimmed,
      format: 'json',
      limit: String(limit),
      countrycodes: 'no',
      addressdetails: '0',
    });

    const userAgent =
      this.config.get<string>('GEOCODING_USER_AGENT') ??
      'RoutePilot/1.0 (logistics-app)';

    let response: Response;
    try {
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          headers: {
            'User-Agent': userAgent,
            'Accept-Language': 'nb,no,en',
          },
        },
      );
    } catch {
      throw new ServiceUnavailableException(
        'Kunne ikke kontakte adressetjenesten. Prøv igjen.',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Adressetjenesten svarte med en feil. Prøv igjen.',
      );
    }

    return (await response.json()) as NominatimResult[];
  }

  private toLocation(hit: NominatimResult): GeocodedLocation {
    const latitude = Number(hit.lat);
    const longitude = Number(hit.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new BadRequestException('Ugyldig svar fra adressetjenesten');
    }

    return {
      latitude,
      longitude,
      displayName: hit.display_name,
    };
  }
}
