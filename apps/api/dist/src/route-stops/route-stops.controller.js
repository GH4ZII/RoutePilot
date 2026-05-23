"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteStopsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const fail_route_stop_dto_1 = require("./dto/fail-route-stop.dto");
const proof_of_delivery_dto_1 = require("./dto/proof-of-delivery.dto");
const route_stops_service_1 = require("./route-stops.service");
let RouteStopsController = class RouteStopsController {
    routeStops;
    constructor(routeStops) {
        this.routeStops = routeStops;
    }
    complete(user, id) {
        return this.routeStops.complete(user, id);
    }
    fail(user, id, dto) {
        return this.routeStops.fail(user, id, dto);
    }
    getProof(user, id) {
        return this.routeStops.getProof(user, id);
    }
    proof(user, id, dto) {
        return this.routeStops.submitProof(user, id, dto);
    }
};
exports.RouteStopsController = RouteStopsController;
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.DRIVER, client_1.UserRole.ADMIN, client_1.UserRole.DISPATCHER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RouteStopsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/fail'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.DRIVER, client_1.UserRole.ADMIN, client_1.UserRole.DISPATCHER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, fail_route_stop_dto_1.FailRouteStopDto]),
    __metadata("design:returntype", void 0)
], RouteStopsController.prototype, "fail", null);
__decorate([
    (0, common_1.Get)(':id/proof'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.DISPATCHER, client_1.UserRole.DRIVER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RouteStopsController.prototype, "getProof", null);
__decorate([
    (0, common_1.Post)(':id/proof'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.DRIVER, client_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, proof_of_delivery_dto_1.ProofOfDeliveryDto]),
    __metadata("design:returntype", void 0)
], RouteStopsController.prototype, "proof", null);
exports.RouteStopsController = RouteStopsController = __decorate([
    (0, common_1.Controller)('route-stops'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [route_stops_service_1.RouteStopsService])
], RouteStopsController);
//# sourceMappingURL=route-stops.controller.js.map