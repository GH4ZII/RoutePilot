import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { DriversController } from './drivers.controller';
import { DriversMeController } from './drivers-me.controller';
import { DriversService } from './drivers.service';

@Module({
  imports: [AuthModule, EventsModule],
  controllers: [DriversController, DriversMeController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
