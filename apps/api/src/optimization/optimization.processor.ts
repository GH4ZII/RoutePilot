import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OPTIMIZATION_QUEUE, OptimizationService } from './optimization.service';

export type OptimizationQueuePayload = {
  jobId: string;
  organizationId: string;
};

@Processor(OPTIMIZATION_QUEUE)
export class OptimizationProcessor extends WorkerHost {
  constructor(private readonly optimization: OptimizationService) {
    super();
  }

  async process(job: Job<OptimizationQueuePayload>): Promise<void> {
    await this.optimization.runJob(job.data.jobId, job.data.organizationId);
  }
}
