import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { RoutingModule } from './routing/routing.module';
import { OptimizationModule } from './optimization/optimization.module';
import { RoutesModule } from './routes/routes.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { DriversModule } from './drivers/drivers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { RouteStopsModule } from './route-stops/route-stops.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    GeocodingModule,
    RoutingModule,
    OptimizationModule,
    RoutesModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    DriversModule,
    VehiclesModule,
    DeliveriesModule,
    RouteStopsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}