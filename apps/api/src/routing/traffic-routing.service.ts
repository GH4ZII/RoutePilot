import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OsrmService } from './osrm.service';
import type { RoutingPoint } from './routing.types';
import type { OsrmTableResult } from './osrm.service';

@Injectable()
export class TrafficRoutingService {
  private readonly logger = new Logger(TrafficRoutingService.name);
  private readonly provider: string;
  private readonly mapboxToken: string | undefined;

  constructor(
    private readonly config: ConfigService,
    private readonly osrm: OsrmService,
  ) {
    this.provider =
      this.config.get<string>('TRAFFIC_PROVIDER')?.trim().toLowerCase() ??
      'none';
    this.mapboxToken = this.config
      .get<string>('MAPBOX_ACCESS_TOKEN')
      ?.trim();
  }

  async getTable(points: RoutingPoint[]): Promise<OsrmTableResult> {
    if (
      this.provider === 'mapbox' &&
      this.mapboxToken &&
      points.length >= 2 &&
      points.length <= 25
    ) {
      try {
        return await this.mapboxMatrix(points);
      } catch (err) {
        this.logger.warn(
          'Mapbox matrix failed, falling back to OSRM',
          err instanceof Error ? err.message : err,
        );
      }
    }
    return this.osrm.getTable(points);
  }

  private async mapboxMatrix(
    points: RoutingPoint[],
  ): Promise<OsrmTableResult> {
    const coordinates = points
      .map((p) => `${p.longitude},${p.latitude}`)
      .join(';');

    const params = new URLSearchParams({
      access_token: this.mapboxToken!,
      annotations: 'duration,distance',
      depart_at: 'now',
    });

    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinates}?${params}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Mapbox HTTP ${response.status}`);
    }

    const body = (await response.json()) as {
      code?: string;
      durations?: (number | null)[][];
      distances?: (number | null)[][];
    };

    if (!body.durations || !body.distances) {
      throw new Error('Mapbox returned invalid matrix');
    }

    const n = points.length;
    const durationsSeconds: number[][] = [];
    const distancesMeters: number[][] = [];

    for (let i = 0; i < n; i++) {
      durationsSeconds[i] = [];
      distancesMeters[i] = [];
      for (let j = 0; j < n; j++) {
        const dur = body.durations[i]?.[j];
        const dist = body.distances[i]?.[j];
        durationsSeconds[i][j] =
          i === j ? 0 : dur != null ? Math.round(dur) : 999_999;
        distancesMeters[i][j] =
          i === j ? 0 : dist != null ? Math.round(dist) : 999_999;
      }
    }

    return { durationsSeconds, distancesMeters };
  }
}
