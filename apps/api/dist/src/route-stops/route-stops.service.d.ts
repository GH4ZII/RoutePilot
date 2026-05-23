import type { JwtPayload } from '../auth/types/jwt-payload';
import { DriverScopeService } from '../common/driver-scope.service';
import { EventsService } from '../events/events.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RouteResponse } from '../routes/routes.service';
import { RoutesService } from '../routes/routes.service';
import { FailRouteStopDto } from './dto/fail-route-stop.dto';
import { ProofOfDeliveryDto } from './dto/proof-of-delivery.dto';
export type ProofOfDeliveryResponse = {
    id: string;
    routeStopId: string;
    photoUrl: string | null;
    signatureUrl: string | null;
    note: string | null;
    latitude: number | null;
    longitude: number | null;
    capturedAt: Date;
};
export declare class RouteStopsService {
    private readonly prisma;
    private readonly routes;
    private readonly driverScope;
    private readonly events;
    private readonly notifications;
    constructor(prisma: PrismaService, routes: RoutesService, driverScope: DriverScopeService, events: EventsService, notifications: NotificationsService);
    complete(user: JwtPayload, stopId: string): Promise<RouteResponse>;
    fail(user: JwtPayload, stopId: string, dto: FailRouteStopDto): Promise<RouteResponse>;
    getProof(user: JwtPayload, stopId: string): Promise<ProofOfDeliveryResponse>;
    submitProof(user: JwtPayload, stopId: string, dto: ProofOfDeliveryDto): Promise<RouteResponse>;
    private assertCanEditStop;
}
