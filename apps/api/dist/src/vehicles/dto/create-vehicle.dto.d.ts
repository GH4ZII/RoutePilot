import { VehicleStatus } from '../../generated/prisma/client';
export declare class CreateVehicleDto {
    name: string;
    registrationNumber: string;
    maxWeightKg: number;
    maxVolumeM3: number;
    startLatitude: number;
    startLongitude: number;
    endLatitude: number;
    endLongitude: number;
    status?: VehicleStatus;
}
