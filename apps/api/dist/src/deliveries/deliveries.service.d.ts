import { DeliveryPriority, DeliveryStatus } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ListDeliveriesQueryDto } from './dto/list-deliveries-query.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
export type ImportCsvResult = {
    created: DeliveryResponse[];
    errors: Array<{
        row: number;
        message: string;
    }>;
};
export type DeliveryResponse = {
    id: string;
    organizationId: string;
    customerName: string;
    phone: string | null;
    address: string;
    latitude: number;
    longitude: number;
    weightKg: number;
    volumeM3: number | null;
    priority: DeliveryPriority;
    deadline: Date | null;
    timeWindowStart: Date | null;
    timeWindowEnd: Date | null;
    notes: string | null;
    status: DeliveryStatus;
    createdAt: Date;
    updatedAt: Date;
};
export declare class DeliveriesService {
    private readonly prisma;
    private readonly orgScope;
    private readonly geocoding;
    constructor(prisma: PrismaService, orgScope: OrgScopeService, geocoding: GeocodingService);
    findAll(user: JwtPayload, query: ListDeliveriesQueryDto): Promise<DeliveryResponse[]>;
    findOne(user: JwtPayload, id: string): Promise<DeliveryResponse>;
    create(user: JwtPayload, dto: CreateDeliveryDto): Promise<DeliveryResponse>;
    update(user: JwtPayload, id: string, dto: UpdateDeliveryDto): Promise<DeliveryResponse>;
    importCsv(user: JwtPayload, csvContent: string): Promise<ImportCsvResult>;
    private createFromCsvRow;
    remove(user: JwtPayload, id: string): Promise<void>;
    private findScopedOrThrow;
    private assertTimeWindow;
}
