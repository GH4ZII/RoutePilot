import { BadRequestException, Injectable } from '@nestjs/common';
import { TrafficRoutingService } from './traffic-routing.service';
import type { DistanceTimeMatrix, RoutingPoint } from './routing.types';

@Injectable()
export class RoutingService {
  constructor(private readonly traffic: TrafficRoutingService) {}

  /**
   * Builds an N×N distance (meters) and duration (seconds) matrix for all point pairs.
   * Row/column index i corresponds to pointIds[i].
   */
  async buildDistanceTimeMatrix(
    points: RoutingPoint[],
  ): Promise<DistanceTimeMatrix> {
    const validated = this.validatePoints(points);
    const table = await this.traffic.getTable(validated);

    return {
      pointIds: validated.map((p) => p.id),
      distancesMeters: table.distancesMeters,
      durationsSeconds: table.durationsSeconds,
    };
  }

  private validatePoints(points: RoutingPoint[]): RoutingPoint[] {
    if (points.length < 2) {
      throw new BadRequestException('Minst to punkter kreves');
    }

    const seen = new Set<string>();
    const validated: RoutingPoint[] = [];

    for (const point of points) {
      const id = point.id?.trim();
      if (!id) {
        throw new BadRequestException('Hvert punkt må ha en id');
      }
      if (seen.has(id)) {
        throw new BadRequestException(`Duplikat id: ${id}`);
      }
      seen.add(id);

      const latitude = Number(point.latitude);
      const longitude = Number(point.longitude);
      if (
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new BadRequestException(
          `Ugyldige koordinater for punkt "${id}"`,
        );
      }

      validated.push({ id, latitude, longitude });
    }

    return validated;
  }
}
