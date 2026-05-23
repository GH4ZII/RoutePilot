import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Organization: "Organization";
    readonly User: "User";
    readonly Driver: "Driver";
    readonly Vehicle: "Vehicle";
    readonly Delivery: "Delivery";
    readonly Route: "Route";
    readonly RouteStop: "RouteStop";
    readonly ProofOfDelivery: "ProofOfDelivery";
    readonly RouteEvent: "RouteEvent";
    readonly OptimizationJob: "OptimizationJob";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const OrganizationScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly organizationId: "organizationId";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly name: "name";
    readonly avatarUrl: "avatarUrl";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const DriverScalarFieldEnum: {
    readonly id: "id";
    readonly organizationId: "organizationId";
    readonly userId: "userId";
    readonly vehicleId: "vehicleId";
    readonly activeRouteId: "activeRouteId";
    readonly name: "name";
    readonly phone: "phone";
    readonly email: "email";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type DriverScalarFieldEnum = (typeof DriverScalarFieldEnum)[keyof typeof DriverScalarFieldEnum];
export declare const VehicleScalarFieldEnum: {
    readonly id: "id";
    readonly organizationId: "organizationId";
    readonly name: "name";
    readonly registrationNumber: "registrationNumber";
    readonly startAddress: "startAddress";
    readonly endAddress: "endAddress";
    readonly maxWeightKg: "maxWeightKg";
    readonly maxVolumeM3: "maxVolumeM3";
    readonly startLatitude: "startLatitude";
    readonly startLongitude: "startLongitude";
    readonly endLatitude: "endLatitude";
    readonly endLongitude: "endLongitude";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type VehicleScalarFieldEnum = (typeof VehicleScalarFieldEnum)[keyof typeof VehicleScalarFieldEnum];
export declare const DeliveryScalarFieldEnum: {
    readonly id: "id";
    readonly organizationId: "organizationId";
    readonly customerName: "customerName";
    readonly phone: "phone";
    readonly address: "address";
    readonly latitude: "latitude";
    readonly longitude: "longitude";
    readonly weightKg: "weightKg";
    readonly volumeM3: "volumeM3";
    readonly priority: "priority";
    readonly deadline: "deadline";
    readonly timeWindowStart: "timeWindowStart";
    readonly timeWindowEnd: "timeWindowEnd";
    readonly notes: "notes";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type DeliveryScalarFieldEnum = (typeof DeliveryScalarFieldEnum)[keyof typeof DeliveryScalarFieldEnum];
export declare const RouteScalarFieldEnum: {
    readonly id: "id";
    readonly organizationId: "organizationId";
    readonly driverId: "driverId";
    readonly vehicleId: "vehicleId";
    readonly status: "status";
    readonly plannedDate: "plannedDate";
    readonly totalDistanceMeters: "totalDistanceMeters";
    readonly totalDurationSeconds: "totalDurationSeconds";
    readonly capacityUsedKg: "capacityUsedKg";
    readonly startedAt: "startedAt";
    readonly finishedAt: "finishedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RouteScalarFieldEnum = (typeof RouteScalarFieldEnum)[keyof typeof RouteScalarFieldEnum];
export declare const RouteStopScalarFieldEnum: {
    readonly id: "id";
    readonly routeId: "routeId";
    readonly deliveryId: "deliveryId";
    readonly stopOrder: "stopOrder";
    readonly estimatedArrival: "estimatedArrival";
    readonly actualArrival: "actualArrival";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RouteStopScalarFieldEnum = (typeof RouteStopScalarFieldEnum)[keyof typeof RouteStopScalarFieldEnum];
export declare const ProofOfDeliveryScalarFieldEnum: {
    readonly id: "id";
    readonly routeStopId: "routeStopId";
    readonly photoUrl: "photoUrl";
    readonly signatureUrl: "signatureUrl";
    readonly note: "note";
    readonly latitude: "latitude";
    readonly longitude: "longitude";
    readonly capturedAt: "capturedAt";
    readonly createdAt: "createdAt";
};
export type ProofOfDeliveryScalarFieldEnum = (typeof ProofOfDeliveryScalarFieldEnum)[keyof typeof ProofOfDeliveryScalarFieldEnum];
export declare const RouteEventScalarFieldEnum: {
    readonly id: "id";
    readonly routeId: "routeId";
    readonly type: "type";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
};
export type RouteEventScalarFieldEnum = (typeof RouteEventScalarFieldEnum)[keyof typeof RouteEventScalarFieldEnum];
export declare const OptimizationJobScalarFieldEnum: {
    readonly id: "id";
    readonly organizationId: "organizationId";
    readonly status: "status";
    readonly objective: "objective";
    readonly plannedDate: "plannedDate";
    readonly request: "request";
    readonly result: "result";
    readonly errorMessage: "errorMessage";
    readonly startedAt: "startedAt";
    readonly completedAt: "completedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OptimizationJobScalarFieldEnum = (typeof OptimizationJobScalarFieldEnum)[keyof typeof OptimizationJobScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
