import type { JwtPayload } from '../auth/types/jwt-payload';
import { AssignRouteDto } from './dto/assign-route.dto';
import { ListRoutesQueryDto } from './dto/list-routes-query.dto';
import { ReoptimizeRouteQueryDto } from './dto/reoptimize-route-query.dto';
import { RoutesReoptimizeService } from './routes-reoptimize.service';
import { RoutesService } from './routes.service';
export declare class RoutesController {
    private readonly routes;
    private readonly reoptimize;
    constructor(routes: RoutesService, reoptimize: RoutesReoptimizeService);
    findAll(user: JwtPayload, query: ListRoutesQueryDto): Promise<import("./routes.service").RouteResponse[]>;
    findMyRoutes(user: JwtPayload): Promise<import("./routes.service").RouteResponse[]>;
    findMyToday(user: JwtPayload): Promise<import("./routes.service").RouteResponse | null>;
    findOne(user: JwtPayload, id: string): Promise<import("./routes.service").RouteResponse>;
    assign(user: JwtPayload, id: string, dto: AssignRouteDto): Promise<import("./routes.service").RouteResponse>;
    start(user: JwtPayload, id: string): Promise<import("./routes.service").RouteResponse>;
    finish(user: JwtPayload, id: string): Promise<import("./routes.service").RouteResponse>;
    reoptimizeRoute(user: JwtPayload, id: string, query: ReoptimizeRouteQueryDto): Promise<import("./routes.service").RouteResponse>;
    remove(user: JwtPayload, id: string): Promise<void>;
}
