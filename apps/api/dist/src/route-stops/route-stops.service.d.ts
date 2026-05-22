import type { JwtPayload } from '../auth/types/jwt-payload';
import { DriverScopeService } from '../common/driver-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RouteResponse } from '../routes/routes.service';
import { RoutesService } from '../routes/routes.service';
import { FailRouteStopDto } from './dto/fail-route-stop.dto';
import { ProofOfDeliveryDto } from './dto/proof-of-delivery.dto';
export declare class RouteStopsService {
    private readonly prisma;
    private readonly routes;
    private readonly driverScope;
    constructor(prisma: PrismaService, routes: RoutesService, driverScope: DriverScopeService);
    complete(user: JwtPayload, stopId: string): Promise<RouteResponse>;
    fail(user: JwtPayload, stopId: string, dto: FailRouteStopDto): Promise<RouteResponse>;
    submitProof(user: JwtPayload, stopId: string, dto: ProofOfDeliveryDto): Promise<RouteResponse>;
    private assertCanEditStop;
}
