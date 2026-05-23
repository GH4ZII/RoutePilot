import { TrafficRoutingService } from './traffic-routing.service';
import type { DistanceTimeMatrix, RoutingPoint } from './routing.types';
export declare class RoutingService {
    private readonly traffic;
    constructor(traffic: TrafficRoutingService);
    buildDistanceTimeMatrix(points: RoutingPoint[]): Promise<DistanceTimeMatrix>;
    private validatePoints;
}
