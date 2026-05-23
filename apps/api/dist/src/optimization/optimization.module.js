"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../auth/auth.module");
const events_module_1 = require("../events/events.module");
const optimization_controller_1 = require("./optimization.controller");
const optimization_processor_1 = require("./optimization.processor");
const optimization_service_1 = require("./optimization.service");
const optimizer_client_service_1 = require("./optimizer-client.service");
let OptimizationModule = class OptimizationModule {
};
exports.OptimizationModule = OptimizationModule;
exports.OptimizationModule = OptimizationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            events_module_1.EventsModule,
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    connection: {
                        host: config.get('REDIS_HOST') ?? '127.0.0.1',
                        port: Number(config.get('REDIS_PORT') ?? 6379),
                    },
                }),
            }),
            bullmq_1.BullModule.registerQueue({ name: optimization_service_1.OPTIMIZATION_QUEUE }),
        ],
        controllers: [optimization_controller_1.OptimizationController],
        providers: [
            optimization_service_1.OptimizationService,
            optimization_processor_1.OptimizationProcessor,
            optimizer_client_service_1.OptimizerClientService,
        ],
        exports: [optimization_service_1.OptimizationService, optimizer_client_service_1.OptimizerClientService],
    })
], OptimizationModule);
//# sourceMappingURL=optimization.module.js.map