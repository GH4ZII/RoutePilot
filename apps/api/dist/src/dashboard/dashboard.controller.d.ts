import type { JwtPayload } from '../auth/types/jwt-payload';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(user: JwtPayload, query: DashboardQueryDto): Promise<import("./dashboard.service").DashboardSummaryResponse>;
    getLiveRoutes(user: JwtPayload, query: DashboardQueryDto): Promise<import("./dashboard.service").LiveRouteResponse[]>;
    getDeliveriesStatus(user: JwtPayload, query: DashboardQueryDto): Promise<import("./dashboard.service").DashboardDeliveriesStatusResponse>;
}
