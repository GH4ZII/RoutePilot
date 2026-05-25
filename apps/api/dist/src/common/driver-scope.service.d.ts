import type { JwtPayload } from '../auth/types/jwt-payload';
import { PrismaService } from '../prisma/prisma.service';
export declare class DriverScopeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findDriverForUser(user: JwtPayload): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        userId: string | null;
        vehicleId: string | null;
        activeRouteId: string | null;
        phone: string | null;
        status: import("../generated/prisma/enums").DriverStatus;
    } | null>;
    requireDriverForUser(user: JwtPayload): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        userId: string | null;
        vehicleId: string | null;
        activeRouteId: string | null;
        phone: string | null;
        status: import("../generated/prisma/enums").DriverStatus;
    }>;
}
