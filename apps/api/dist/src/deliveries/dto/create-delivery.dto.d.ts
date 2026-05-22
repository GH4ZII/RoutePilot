import { DeliveryPriority, DeliveryStatus } from '../../generated/prisma/client';
export declare class CreateDeliveryDto {
    customerName: string;
    phone?: string;
    address: string;
    latitude: number;
    longitude: number;
    weightKg: number;
    volumeM3?: number;
    priority?: DeliveryPriority;
    deadline?: string;
    timeWindowStart?: string;
    timeWindowEnd?: string;
    notes?: string;
    status?: DeliveryStatus;
}
