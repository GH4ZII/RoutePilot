"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteEventType = exports.OptimizationObjective = exports.OptimizationJobStatus = exports.RouteStopStatus = exports.RouteStatus = exports.DeliveryPriority = exports.DeliveryStatus = exports.VehicleStatus = exports.DriverStatus = exports.UserRole = void 0;
exports.UserRole = {
    ADMIN: 'ADMIN',
    DISPATCHER: 'DISPATCHER',
    DRIVER: 'DRIVER'
};
exports.DriverStatus = {
    AVAILABLE: 'AVAILABLE',
    ON_ROUTE: 'ON_ROUTE',
    UNAVAILABLE: 'UNAVAILABLE',
    OFF_DUTY: 'OFF_DUTY'
};
exports.VehicleStatus = {
    AVAILABLE: 'AVAILABLE',
    IN_USE: 'IN_USE',
    MAINTENANCE: 'MAINTENANCE',
    UNAVAILABLE: 'UNAVAILABLE'
};
exports.DeliveryStatus = {
    PENDING: 'PENDING',
    ASSIGNED: 'ASSIGNED',
    IN_PROGRESS: 'IN_PROGRESS',
    DELIVERED: 'DELIVERED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED'
};
exports.DeliveryPriority = {
    LOW: 'LOW',
    NORMAL: 'NORMAL',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};
exports.RouteStatus = {
    PLANNED: 'PLANNED',
    ASSIGNED: 'ASSIGNED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};
exports.RouteStopStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    SKIPPED: 'SKIPPED'
};
exports.OptimizationJobStatus = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};
exports.OptimizationObjective = {
    MINIMIZE_TOTAL_DISTANCE: 'MINIMIZE_TOTAL_DISTANCE',
    MINIMIZE_TOTAL_TIME: 'MINIMIZE_TOTAL_TIME',
    BALANCE_WORKLOAD: 'BALANCE_WORKLOAD',
    PRIORITIZE_URGENT: 'PRIORITIZE_URGENT',
    MINIMIZE_LATE_DELIVERIES: 'MINIMIZE_LATE_DELIVERIES'
};
exports.RouteEventType = {
    ROUTE_STARTED: 'ROUTE_STARTED',
    STOP_COMPLETED: 'STOP_COMPLETED',
    STOP_FAILED: 'STOP_FAILED',
    ROUTE_FINISHED: 'ROUTE_FINISHED',
    DRIVER_DELAYED: 'DRIVER_DELAYED'
};
//# sourceMappingURL=enums.js.map