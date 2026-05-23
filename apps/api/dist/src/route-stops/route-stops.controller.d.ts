import type { JwtPayload } from '../auth/types/jwt-payload';
import { FailRouteStopDto } from './dto/fail-route-stop.dto';
import { ProofOfDeliveryDto } from './dto/proof-of-delivery.dto';
import { RouteStopsService } from './route-stops.service';
export declare class RouteStopsController {
    private readonly routeStops;
    constructor(routeStops: RouteStopsService);
    complete(user: JwtPayload, id: string): Promise<import("../routes/routes.service").RouteResponse>;
    fail(user: JwtPayload, id: string, dto: FailRouteStopDto): Promise<import("../routes/routes.service").RouteResponse>;
    getProof(user: JwtPayload, id: string): Promise<import("./route-stops.service").ProofOfDeliveryResponse>;
    proof(user: JwtPayload, id: string, dto: ProofOfDeliveryDto): Promise<import("../routes/routes.service").RouteResponse>;
}
