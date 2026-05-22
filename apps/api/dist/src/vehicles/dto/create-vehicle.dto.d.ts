import { VehicleStatus } from '../../generated/prisma/client';
export declare class CreateVehicleDto {
    name: string;
    registrationNumber: string;
    startAddress: string;
    endAddress: string;
    maxWeightKg: number;
    maxVolumeM3: number;
    status?: VehicleStatus;
}
