"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
const geocoding_module_1 = require("./geocoding/geocoding.module");
const routing_module_1 = require("./routing/routing.module");
const optimization_module_1 = require("./optimization/optimization.module");
const routes_module_1 = require("./routes/routes.module");
const organizations_module_1 = require("./organizations/organizations.module");
const users_module_1 = require("./users/users.module");
const drivers_module_1 = require("./drivers/drivers.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const deliveries_module_1 = require("./deliveries/deliveries.module");
const route_stops_module_1 = require("./route-stops/route-stops.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const reports_module_1 = require("./reports/reports.module");
const events_module_1 = require("./events/events.module");
const depots_module_1 = require("./depots/depots.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: 60_000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            common_module_1.CommonModule,
            geocoding_module_1.GeocodingModule,
            routing_module_1.RoutingModule,
            optimization_module_1.OptimizationModule,
            routes_module_1.RoutesModule,
            auth_module_1.AuthModule,
            organizations_module_1.OrganizationsModule,
            users_module_1.UsersModule,
            drivers_module_1.DriversModule,
            vehicles_module_1.VehiclesModule,
            deliveries_module_1.DeliveriesModule,
            route_stops_module_1.RouteStopsModule,
            dashboard_module_1.DashboardModule,
            reports_module_1.ReportsModule,
            events_module_1.EventsModule,
            depots_module_1.DepotsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map