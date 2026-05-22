"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteStopsModule = void 0;
const common_1 = require("@nestjs/common");
const routes_module_1 = require("../routes/routes.module");
const route_stops_controller_1 = require("./route-stops.controller");
const route_stops_service_1 = require("./route-stops.service");
let RouteStopsModule = class RouteStopsModule {
};
exports.RouteStopsModule = RouteStopsModule;
exports.RouteStopsModule = RouteStopsModule = __decorate([
    (0, common_1.Module)({
        imports: [routes_module_1.RoutesModule],
        controllers: [route_stops_controller_1.RouteStopsController],
        providers: [route_stops_service_1.RouteStopsService],
    })
], RouteStopsModule);
//# sourceMappingURL=route-stops.module.js.map