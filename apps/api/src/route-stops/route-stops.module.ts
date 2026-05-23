import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RoutesModule } from '../routes/routes.module';
import { RouteStopsController } from './route-stops.controller';
import { RouteStopsService } from './route-stops.service';

@Module({
  imports: [RoutesModule, EventsModule, NotificationsModule],
  controllers: [RouteStopsController],
  providers: [RouteStopsService],
})
export class RouteStopsModule {}
