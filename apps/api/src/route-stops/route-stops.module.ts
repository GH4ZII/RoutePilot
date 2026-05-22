import { Module } from '@nestjs/common';
import { RoutesModule } from '../routes/routes.module';
import { RouteStopsController } from './route-stops.controller';
import { RouteStopsService } from './route-stops.service';

@Module({
  imports: [RoutesModule],
  controllers: [RouteStopsController],
  providers: [RouteStopsService],
})
export class RouteStopsModule {}
