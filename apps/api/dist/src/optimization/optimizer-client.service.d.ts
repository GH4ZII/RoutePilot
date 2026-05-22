import { ConfigService } from '@nestjs/config';
export type OptimizerSolveResult = {
    routeIndices: number[];
    totalCost: number;
};
export declare class OptimizerClientService {
    private readonly config;
    private readonly baseUrl;
    constructor(config: ConfigService);
    solveTsp(durationMatrix: number[][]): Promise<OptimizerSolveResult>;
}
