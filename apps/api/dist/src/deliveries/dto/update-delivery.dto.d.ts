import { DeliveryPriority, DeliveryStatus } from '../../generated/prisma/client';
export declare class UpdateDeliveryDto {
    customerName?: string;
    phone?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    weightKg?: number;
    volumeM3?: number;
    priority?: DeliveryPriority;
    deadline?: string | null;
    timeWindowStart?: string | null;
    timeWindowEnd?: string | null;
    notes?: string;
    status?: DeliveryStatus;
}
