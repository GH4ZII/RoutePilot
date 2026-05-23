import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OsrmService } from './osrm.service';
import { RoutingController } from './routing.controller';
import { RoutingService } from './routing.service';
import { TrafficRoutingService } from './traffic-routing.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [RoutingController],
  providers: [OsrmService, TrafficRoutingService, RoutingService],
  exports: [RoutingService, OsrmService, TrafficRoutingService],
})
export class RoutingModule {}
