import { OptimizationObjective } from '../../generated/prisma/client';
export declare class CreateOptimizationJobDto {
    plannedDate: string;
    vehicleId: string;
    driverId?: string;
    deliveryIds: string[];
    objective?: OptimizationObjective;
    routeStartTime?: string;
    returnToDepot?: boolean;
}
