import { DriverStatus } from '../../generated/prisma/client';
export declare class CreateDriverDto {
    name: string;
    phone?: string;
    email?: string;
    password?: string;
    status?: DriverStatus;
    userId?: string;
    vehicleId?: string;
}
