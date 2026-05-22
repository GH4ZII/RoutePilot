import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreateOptimizationJobDto } from './dto/create-optimization-job.dto';
import { OptimizationService } from './optimization.service';
export declare class OptimizationController {
    private readonly optimization;
    constructor(optimization: OptimizationService);
    create(user: JwtPayload, dto: CreateOptimizationJobDto): Promise<import("./optimization.service").OptimizationJobResponse>;
    findOne(user: JwtPayload, id: string): Promise<import("./optimization.service").OptimizationJobResponse>;
}
