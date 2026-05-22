import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type OptimizerSolveResult = {
  routeIndices: number[];
  totalCost: number;
};

type OptimizerSolveResponse = {
  route_indices: number[];
  total_cost: number;
};

@Injectable()
export class OptimizerClientService {
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    const configured = this.config.get<string>('OPTIMIZER_URL')?.trim();
    this.baseUrl = (configured ?? 'http://localhost:8000').replace(/\/$/, '');
  }

  async solveTsp(durationMatrix: number[][]): Promise<OptimizerSolveResult> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          duration_matrix: durationMatrix,
          depot_index: 0,
          cost_type: 'duration',
        }),
      });
    } catch {
      throw new ServiceUnavailableException(
        'Kunne ikke kontakte optimaliseringstjenesten (Python/OR-Tools). Er den startet?',
      );
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new ServiceUnavailableException(
        detail || `Optimaliseringstjenesten svarte med HTTP ${response.status}`,
      );
    }

    const body = (await response.json()) as OptimizerSolveResponse;
    return {
      routeIndices: body.route_indices,
      totalCost: body.total_cost,
    };
  }
}
