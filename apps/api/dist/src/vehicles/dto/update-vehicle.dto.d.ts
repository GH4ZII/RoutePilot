import { VehicleStatus } from '../../generated/prisma/client';
export declare class UpdateVehicleDto {
    name?: string;
    registrationNumber?: string;
    startAddress?: string;
    endAddress?: string;
    maxWeightKg?: number;
    maxVolumeM3?: number;
    status?: VehicleStatus;
}
