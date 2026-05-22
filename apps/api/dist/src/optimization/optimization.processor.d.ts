import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OptimizationService } from './optimization.service';
export type OptimizationQueuePayload = {
    jobId: string;
    organizationId: string;
};
export declare class OptimizationProcessor extends WorkerHost {
    private readonly optimization;
    constructor(optimization: OptimizationService);
    process(job: Job<OptimizationQueuePayload>): Promise<void>;
}
