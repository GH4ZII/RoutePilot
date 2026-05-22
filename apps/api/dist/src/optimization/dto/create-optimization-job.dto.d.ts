import { OptimizationObjective } from '../../generated/prisma/client';
export declare class CreateOptimizationJobDto {
    plannedDate: string;
    vehicleId?: string;
    vehicleIds?: string[];
    driverIds?: string[];
    deliveryIds: string[];
    objective?: OptimizationObjective;
    routeStartTime?: string;
    returnToDepot?: boolean;
    respectCapacity?: boolean;
    respectTimeWindows?: boolean;
}
