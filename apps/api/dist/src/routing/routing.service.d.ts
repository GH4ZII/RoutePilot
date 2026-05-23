import { OsrmService } from './osrm.service';
import type { DistanceTimeMatrix, RoutingPoint } from './routing.types';
export declare class RoutingService {
    private readonly osrm;
    constructor(osrm: OsrmService);
    buildDistanceTimeMatrix(points: RoutingPoint[]): Promise<DistanceTimeMatrix>;
    private validatePoints;
}
