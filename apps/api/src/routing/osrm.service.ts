import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RoutingPoint } from './routing.types';

type OsrmTableResponse = {
  code: string;
  distances?: (number | null)[][];
  durations?: (number | null)[][];
  message?: string;
};

export type OsrmTableResult = {
  distancesMeters: number[][];
  durationsSeconds: number[][];
};

/** Public OSRM demo allows ~100 coordinates per table request. */
export const OSRM_MAX_POINTS = 100;

@Injectable()
export class OsrmService {
  private readonly baseUrl: string;
  private readonly profile: string;

  constructor(private readonly config: ConfigService) {
    const configured = this.config.get<string>('OSRM_BASE_URL')?.trim();
    this.baseUrl = (configured ?? 'https://router.project-osrm.org').replace(
      /\/$/,
      '',
    );
    this.profile = this.config.get<string>('OSRM_PROFILE')?.trim() || 'driving';
  }

  async getTable(points: RoutingPoint[]): Promise<OsrmTableResult> {
    if (points.length < 2) {
      throw new BadRequestException('Minst to punkter kreves for matrise');
    }
    if (points.length > OSRM_MAX_POINTS) {
      throw new BadRequestException(
        `Maks ${OSRM_MAX_POINTS} punkter per matrise (OSRM-grense)`,
      );
    }

    const coordinatePath = points
      .map((p) => `${p.longitude},${p.latitude}`)
      .join(';');

    const params = new URLSearchParams({
      annotations: 'duration,distance',
    });

    const url = `${this.baseUrl}/table/v1/${this.profile}/${coordinatePath}?${params}`;

    let response: Response;
    try {
      response = await fetch(url, { headers: { Accept: 'application/json' } });
    } catch {
      throw new ServiceUnavailableException(
        'Kunne ikke kontakte OSRM. Sjekk OSRM_BASE_URL eller nettverk.',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `OSRM svarte med HTTP ${response.status}. Prøv igjen senere.`,
      );
    }

    const body = (await response.json()) as OsrmTableResponse;

    if (body.code !== 'Ok' || !body.distances || !body.durations) {
      throw new ServiceUnavailableException(
        body.message ?? `OSRM returnerte kode: ${body.code}`,
      );
    }

    return {
      distancesMeters: body.distances.map((row) =>
        row.map((value) => this.normalizeMatrixCell(value, 'meter')),
      ),
      durationsSeconds: body.durations.map((row) =>
        row.map((value) => this.normalizeMatrixCell(value, 'sekund')),
      ),
    };
  }

  private normalizeMatrixCell(
    value: number | null,
    unit: 'meter' | 'sekund',
  ): number {
    if (value === null || !Number.isFinite(value)) {
      throw new ServiceUnavailableException(
        `OSRM fant ingen kjørbare rute mellom to punkter (${unit})`,
      );
    }
    return Math.round(value * 10) / 10;
  }
}
