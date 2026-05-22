import { BuildMatrixDto } from './dto/build-matrix.dto';
import { RoutingService } from './routing.service';
export declare class RoutingController {
    private readonly routing;
    constructor(routing: RoutingService);
    buildMatrix(body: BuildMatrixDto): Promise<import("./routing.types").DistanceTimeMatrix>;
}
