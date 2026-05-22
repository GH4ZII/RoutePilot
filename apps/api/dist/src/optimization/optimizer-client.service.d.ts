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
export declare class OptimizerClientService {
    private readonly config;
    private readonly baseUrl;
    constructor(config: ConfigService);
    solveTsp(durationMatrix: number[][]): Promise<OptimizerSolveResult>;
    solveVrp(payload: VrpSolvePayload): Promise<VrpSolveResult>;
}
