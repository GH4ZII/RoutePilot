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
exports.GeocodingController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const suggest_address_query_dto_1 = require("./dto/suggest-address-query.dto");
const geocoding_service_1 = require("./geocoding.service");
let GeocodingController = class GeocodingController {
    geocoding;
    constructor(geocoding) {
        this.geocoding = geocoding;
    }
    suggest(query) {
        return this.geocoding.suggest(query.q);
    }
};
exports.GeocodingController = GeocodingController;
__decorate([
    (0, common_1.Get)('suggest'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [suggest_address_query_dto_1.SuggestAddressQueryDto]),
    __metadata("design:returntype", void 0)
], GeocodingController.prototype, "suggest", null);
exports.GeocodingController = GeocodingController = __decorate([
    (0, common_1.Controller)('geocoding'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.DISPATCHER),
    __metadata("design:paramtypes", [geocoding_service_1.GeocodingService])
], GeocodingController);
//# sourceMappingURL=geocoding.controller.js.map