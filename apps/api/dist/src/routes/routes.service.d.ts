import { RouteStatus, RouteStopStatus } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { ListRoutesQueryDto } from './dto/list-routes-query.dto';
export type RouteStopResponse = {
    id: string;
    stopOrder: number;
    estimatedArrival: Date | null;
    status: RouteStopStatus;
    delivery: {
        id: string;
        customerName: string;
        address: string;
        latitude: number;
        longitude: number;
        status: string;
        priority: string;
    };
};
export type RouteResponse = {
    id: string;
    organizationId: string;
    driverId: string | null;
    vehicleId: string | null;
    status: RouteStatus;
    plannedDate: Date;
    totalDistanceMeters: number | null;
    totalDurationSeconds: number | null;
    vehicle: {
        id: string;
        name: string;
        startAddress: string;
        endAddress: string;
        startLatitude: number;
        startLongitude: number;
        endLatitude: number;
        endLongitude: number;
    } | null;
    stops: RouteStopResponse[];
    createdAt: Date;
    updatedAt: Date;
};
export declare class RoutesService {
    private readonly prisma;
    private readonly orgScope;
    constructor(prisma: PrismaService, orgScope: OrgScopeService);
    findAll(user: JwtPayload, query: ListRoutesQueryDto): Promise<RouteResponse[]>;
    findOne(user: JwtPayload, id: string): Promise<RouteResponse>;
}
