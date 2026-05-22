import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OptimizationObjective } from '../generated/prisma/client';

export type OptimizerSolveResult = {
  routeIndices: number[];
  totalCost: number;
};

export type VrpDeliveryPayload = {
  node_index: number;
  delivery_index: number;
  weight_units: number;
  volume_units: number;
  package_count: number;
  time_window_start_sec: number | null;
  time_window_end_sec: number | null;
  deadline_sec: number | null;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  drop_penalty?: number;
};

export type VrpVehiclePayload = {
  start_index: number;
  end_index: number;
  max_weight_units: number;
  max_volume_units: number;
  max_packages: number;
};

export type VrpSolvePayload = {
  duration_matrix: number[][];
  distance_matrix: number[][];
  vehicles: VrpVehiclePayload[];
  deliveries: VrpDeliveryPayload[];
  objective: OptimizationObjective;
  respect_capacity: boolean;
  respect_time_windows: boolean;
  service_time_sec: number;
  horizon_sec: number;
};

export type VrpRouteResult = {
  vehicleIndex: number;
  routeIndices: number[];
  totalCost: number;
};

export type VrpSolveResult = {
  routes: VrpRouteResult[];
  unassignedDeliveryIndices: number[];
};

type OptimizerSolveResponse = {
  route_indices: number[];
  total_cost: number;
};

type OptimizerVrpRouteResponse = {
  vehicle_index: number;
  route_indices: number[];
  total_cost: number;
};

type OptimizerVrpSolveResponse = {
  routes: OptimizerVrpRouteResponse[];
  unassigned_delivery_indices: number[];
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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
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

  async solveVrp(payload: VrpSolvePayload): Promise<VrpSolveResult> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/solve-vrp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          duration_matrix: payload.duration_matrix,
          distance_matrix: payload.distance_matrix,
          vehicles: payload.vehicles.map((v) => ({
            start_index: v.start_index,
            end_index: v.end_index,
            max_weight_units: v.max_weight_units,
            max_volume_units: v.max_volume_units,
            max_packages: v.max_packages,
          })),
          deliveries: payload.deliveries.map((d) => ({
            node_index: d.node_index,
            delivery_index: d.delivery_index,
            weight_units: d.weight_units,
            volume_units: d.volume_units,
            package_count: d.package_count,
            time_window_start_sec: d.time_window_start_sec,
            time_window_end_sec: d.time_window_end_sec,
            deadline_sec: d.deadline_sec,
            priority: d.priority,
            drop_penalty: d.drop_penalty,
          })),
          objective: payload.objective,
          respect_capacity: payload.respect_capacity,
          respect_time_windows: payload.respect_time_windows,
          service_time_sec: payload.service_time_sec,
          horizon_sec: payload.horizon_sec,
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
        detail || `VRP-tjenesten svarte med HTTP ${response.status}`,
      );
    }

    const body = (await response.json()) as OptimizerVrpSolveResponse;
    return {
      routes: body.routes.map((r) => ({
        vehicleIndex: r.vehicle_index,
        routeIndices: r.route_indices,
        totalCost: r.total_cost,
      })),
      unassignedDeliveryIndices: body.unassigned_delivery_indices,
    };
  }
}
