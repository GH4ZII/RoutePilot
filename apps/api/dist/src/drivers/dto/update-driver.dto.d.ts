import { DriverStatus } from '../../generated/prisma/client';
export declare class UpdateDriverDto {
    name?: string;
    phone?: string;
    email?: string;
    status?: DriverStatus;
    userId?: string | null;
    vehicleId?: string | null;
}
