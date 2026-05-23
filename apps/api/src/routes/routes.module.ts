import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { OptimizationModule } from '../optimization/optimization.module';
import { RoutesController } from './routes.controller';
import { RouteSummaryService } from './route-summary.service';
import { RoutesReoptimizeService } from './routes-reoptimize.service';
import { RoutesService } from './routes.service';

@Module({
  imports: [AuthModule, EventsModule, OptimizationModule],
  controllers: [RoutesController],
  providers: [RoutesService, RoutesReoptimizeService, RouteSummaryService],
  exports: [RoutesService],
})
export class RoutesModule {}
