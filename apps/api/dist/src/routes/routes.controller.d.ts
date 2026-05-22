import type { JwtPayload } from '../auth/types/jwt-payload';
import { ListRoutesQueryDto } from './dto/list-routes-query.dto';
import { RoutesService } from './routes.service';
export declare class RoutesController {
    private readonly routes;
    constructor(routes: RoutesService);
    findAll(user: JwtPayload, query: ListRoutesQueryDto): Promise<import("./routes.service").RouteResponse[]>;
    findOne(user: JwtPayload, id: string): Promise<import("./routes.service").RouteResponse>;
}
