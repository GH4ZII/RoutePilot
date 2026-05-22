import { ConfigService } from '@nestjs/config';
import type { RoutingPoint } from './routing.types';
export type OsrmTableResult = {
    distancesMeters: number[][];
    durationsSeconds: number[][];
};
export declare const OSRM_MAX_POINTS = 100;
export declare class OsrmService {
    private readonly config;
    private readonly baseUrl;
    private readonly profile;
    constructor(config: ConfigService);
    getTable(points: RoutingPoint[]): Promise<OsrmTableResult>;
    private normalizeMatrixCell;
}
