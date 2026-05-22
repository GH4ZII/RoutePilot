import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { OptimizationController } from './optimization.controller';
import { OptimizationProcessor } from './optimization.processor';
import {
  OPTIMIZATION_QUEUE,
  OptimizationService,
} from './optimization.service';
import { OptimizerClientService } from './optimizer-client.service';

@Module({
  imports: [
    AuthModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST') ?? '127.0.0.1',
          port: Number(config.get<string>('REDIS_PORT') ?? 6379),
        },
      }),
    }),
    BullModule.registerQueue({ name: OPTIMIZATION_QUEUE }),
  ],
  controllers: [OptimizationController],
  providers: [
    OptimizationService,
    OptimizationProcessor,
    OptimizerClientService,
  ],
  exports: [OptimizationService],
})
export class OptimizationModule {}
