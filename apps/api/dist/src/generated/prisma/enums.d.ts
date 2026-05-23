export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly DISPATCHER: "DISPATCHER";
    readonly DRIVER: "DRIVER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const DriverStatus: {
    readonly AVAILABLE: "AVAILABLE";
    readonly ON_ROUTE: "ON_ROUTE";
    readonly UNAVAILABLE: "UNAVAILABLE";
    readonly OFF_DUTY: "OFF_DUTY";
};
export type DriverStatus = (typeof DriverStatus)[keyof typeof DriverStatus];
export declare const VehicleStatus: {
    readonly AVAILABLE: "AVAILABLE";
    readonly IN_USE: "IN_USE";
    readonly MAINTENANCE: "MAINTENANCE";
    readonly UNAVAILABLE: "UNAVAILABLE";
};
export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus];
export declare const DeliveryStatus: {
    readonly PENDING: "PENDING";
    readonly ASSIGNED: "ASSIGNED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly DELIVERED: "DELIVERED";
    readonly FAILED: "FAILED";
    readonly CANCELLED: "CANCELLED";
};
export type DeliveryStatus = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];
export declare const DeliveryPriority: {
    readonly LOW: "LOW";
    readonly NORMAL: "NORMAL";
    readonly HIGH: "HIGH";
    readonly CRITICAL: "CRITICAL";
};
export type DeliveryPriority = (typeof DeliveryPriority)[keyof typeof DeliveryPriority];
export declare const RouteStatus: {
    readonly PLANNED: "PLANNED";
    readonly ASSIGNED: "ASSIGNED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type RouteStatus = (typeof RouteStatus)[keyof typeof RouteStatus];
export declare const RouteStopStatus: {
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly SKIPPED: "SKIPPED";
};
export type RouteStopStatus = (typeof RouteStopStatus)[keyof typeof RouteStopStatus];
export declare const OptimizationJobStatus: {
    readonly PENDING: "PENDING";
    readonly RUNNING: "RUNNING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type OptimizationJobStatus = (typeof OptimizationJobStatus)[keyof typeof OptimizationJobStatus];
export declare const OptimizationObjective: {
    readonly MINIMIZE_TOTAL_DISTANCE: "MINIMIZE_TOTAL_DISTANCE";
    readonly MINIMIZE_TOTAL_TIME: "MINIMIZE_TOTAL_TIME";
    readonly BALANCE_WORKLOAD: "BALANCE_WORKLOAD";
    readonly PRIORITIZE_URGENT: "PRIORITIZE_URGENT";
    readonly MINIMIZE_LATE_DELIVERIES: "MINIMIZE_LATE_DELIVERIES";
};
export type OptimizationObjective = (typeof OptimizationObjective)[keyof typeof OptimizationObjective];
export declare const RouteEventType: {
    readonly ROUTE_STARTED: "ROUTE_STARTED";
    readonly STOP_COMPLETED: "STOP_COMPLETED";
    readonly STOP_FAILED: "STOP_FAILED";
    readonly ROUTE_FINISHED: "ROUTE_FINISHED";
    readonly DRIVER_DELAYED: "DRIVER_DELAYED";
};
export type RouteEventType = (typeof RouteEventType)[keyof typeof RouteEventType];
export declare const NotificationChannel: {
    readonly SMS: "SMS";
    readonly EMAIL: "EMAIL";
};
export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];
export declare const NotificationType: {
    readonly ETA: "ETA";
    readonly DELIVERED: "DELIVERED";
    readonly FAILED: "FAILED";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const NotificationStatus: {
    readonly PENDING: "PENDING";
    readonly SENT: "SENT";
    readonly FAILED: "FAILED";
};
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
