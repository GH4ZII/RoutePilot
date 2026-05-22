import { VehicleStatus } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export type VehicleResponse = {
    id: string;
    organizationId: string;
    name: string;
    registrationNumber: string;
    startAddress: string;
    endAddress: string;
    maxWeightKg: number;
    maxVolumeM3: number;
    startLatitude: number;
    startLongitude: number;
    endLatitude: number;
    endLongitude: number;
    status: VehicleStatus;
    createdAt: Date;
    updatedAt: Date;
};
export declare class VehiclesService {
    private readonly prisma;
    private readonly orgScope;
    private readonly geocoding;
    constructor(prisma: PrismaService, orgScope: OrgScopeService, geocoding: GeocodingService);
    findAll(user: JwtPayload, query: ListVehiclesQueryDto): Promise<VehicleResponse[]>;
    findOne(user: JwtPayload, id: string): Promise<VehicleResponse>;
    create(user: JwtPayload, dto: CreateVehicleDto): Promise<VehicleResponse>;
    update(user: JwtPayload, id: string, dto: UpdateVehicleDto): Promise<VehicleResponse>;
    remove(user: JwtPayload, id: string): Promise<void>;
    private findScopedOrThrow;
}
