"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.JsonNullValueInput = exports.NullableJsonNullValueInput = exports.SortOrder = exports.OptimizationJobScalarFieldEnum = exports.CustomerNotificationScalarFieldEnum = exports.RouteSummaryScalarFieldEnum = exports.RouteEventScalarFieldEnum = exports.ProofOfDeliveryScalarFieldEnum = exports.RouteStopScalarFieldEnum = exports.RouteScalarFieldEnum = exports.DeliveryScalarFieldEnum = exports.VehicleScalarFieldEnum = exports.DepotScalarFieldEnum = exports.DriverLocationScalarFieldEnum = exports.DriverScalarFieldEnum = exports.UserScalarFieldEnum = exports.OrganizationScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Organization: 'Organization',
    User: 'User',
    Driver: 'Driver',
    DriverLocation: 'DriverLocation',
    Depot: 'Depot',
    Vehicle: 'Vehicle',
    Delivery: 'Delivery',
    Route: 'Route',
    RouteStop: 'RouteStop',
    ProofOfDelivery: 'ProofOfDelivery',
    RouteEvent: 'RouteEvent',
    RouteSummary: 'RouteSummary',
    CustomerNotification: 'CustomerNotification',
    OptimizationJob: 'OptimizationJob'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.OrganizationScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    name: 'name',
    avatarUrl: 'avatarUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.DriverScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    userId: 'userId',
    vehicleId: 'vehicleId',
    activeRouteId: 'activeRouteId',
    name: 'name',
    phone: 'phone',
    email: 'email',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.DriverLocationScalarFieldEnum = {
    id: 'id',
    driverId: 'driverId',
    latitude: 'latitude',
    longitude: 'longitude',
    heading: 'heading',
    speed: 'speed',
    recordedAt: 'recordedAt',
    updatedAt: 'updatedAt'
};
exports.DepotScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    name: 'name',
    address: 'address',
    latitude: 'latitude',
    longitude: 'longitude',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.VehicleScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    depotId: 'depotId',
    name: 'name',
    registrationNumber: 'registrationNumber',
    startAddress: 'startAddress',
    endAddress: 'endAddress',
    maxWeightKg: 'maxWeightKg',
    maxVolumeM3: 'maxVolumeM3',
    startLatitude: 'startLatitude',
    startLongitude: 'startLongitude',
    endLatitude: 'endLatitude',
    endLongitude: 'endLongitude',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.DeliveryScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    customerName: 'customerName',
    phone: 'phone',
    address: 'address',
    latitude: 'latitude',
    longitude: 'longitude',
    weightKg: 'weightKg',
    volumeM3: 'volumeM3',
    priority: 'priority',
    deadline: 'deadline',
    timeWindowStart: 'timeWindowStart',
    timeWindowEnd: 'timeWindowEnd',
    notes: 'notes',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RouteScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    driverId: 'driverId',
    vehicleId: 'vehicleId',
    status: 'status',
    plannedDate: 'plannedDate',
    totalDistanceMeters: 'totalDistanceMeters',
    totalDurationSeconds: 'totalDurationSeconds',
    actualDistanceMeters: 'actualDistanceMeters',
    actualDurationSeconds: 'actualDurationSeconds',
    capacityUsedKg: 'capacityUsedKg',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RouteStopScalarFieldEnum = {
    id: 'id',
    routeId: 'routeId',
    deliveryId: 'deliveryId',
    stopOrder: 'stopOrder',
    estimatedArrival: 'estimatedArrival',
    actualArrival: 'actualArrival',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProofOfDeliveryScalarFieldEnum = {
    id: 'id',
    routeStopId: 'routeStopId',
    photoUrl: 'photoUrl',
    signatureUrl: 'signatureUrl',
    note: 'note',
    latitude: 'latitude',
    longitude: 'longitude',
    capturedAt: 'capturedAt',
    createdAt: 'createdAt'
};
exports.RouteEventScalarFieldEnum = {
    id: 'id',
    routeId: 'routeId',
    type: 'type',
    metadata: 'metadata',
    createdAt: 'createdAt'
};
exports.RouteSummaryScalarFieldEnum = {
    id: 'id',
    routeId: 'routeId',
    summary: 'summary',
    model: 'model',
    generatedAt: 'generatedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CustomerNotificationScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    deliveryId: 'deliveryId',
    channel: 'channel',
    type: 'type',
    status: 'status',
    payload: 'payload',
    errorMessage: 'errorMessage',
    sentAt: 'sentAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.OptimizationJobScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    status: 'status',
    objective: 'objective',
    plannedDate: 'plannedDate',
    request: 'request',
    result: 'result',
    errorMessage: 'errorMessage',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map