import { DriverStatus } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { ListDriversQueryDto } from './dto/list-drivers-query.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
export type DriverResponse = {
    id: string;
    organizationId: string;
    userId: string | null;
    vehicleId: string | null;
    activeRouteId: string | null;
    name: string;
    phone: string | null;
    email: string | null;
    status: DriverStatus;
    createdAt: Date;
    updatedAt: Date;
};
export declare class DriversService {
    private readonly prisma;
    private readonly orgScope;
    constructor(prisma: PrismaService, orgScope: OrgScopeService);
    findAll(user: JwtPayload, query: ListDriversQueryDto): Promise<DriverResponse[]>;
    findOne(user: JwtPayload, id: string): Promise<DriverResponse>;
    create(user: JwtPayload, dto: CreateDriverDto): Promise<DriverResponse>;
    update(user: JwtPayload, id: string, dto: UpdateDriverDto): Promise<DriverResponse>;
    remove(user: JwtPayload, id: string): Promise<void>;
    private findScopedOrThrow;
    private assertUserInOrg;
    private assertVehicleInOrg;
}
