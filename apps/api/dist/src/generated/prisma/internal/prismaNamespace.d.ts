import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "organization" | "user" | "driver" | "vehicle" | "delivery" | "route" | "routeStop" | "proofOfDelivery" | "routeEvent" | "optimizationJob";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Organization: {
            payload: Prisma.$OrganizationPayload<ExtArgs>;
            fields: Prisma.OrganizationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrganizationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>;
                };
                findFirst: {
                    args: Prisma.OrganizationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>;
                };
                findMany: {
                    args: Prisma.OrganizationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>[];
                };
                create: {
                    args: Prisma.OrganizationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>;
                };
                createMany: {
                    args: Prisma.OrganizationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>[];
                };
                delete: {
                    args: Prisma.OrganizationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>;
                };
                update: {
                    args: Prisma.OrganizationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>;
                };
                deleteMany: {
                    args: Prisma.OrganizationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrganizationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OrganizationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>[];
                };
                upsert: {
                    args: Prisma.OrganizationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizationPayload>;
                };
                aggregate: {
                    args: Prisma.OrganizationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrganization>;
                };
                groupBy: {
                    args: Prisma.OrganizationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrganizationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrganizationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrganizationCountAggregateOutputType> | number;
                };
            };
        };
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Driver: {
            payload: Prisma.$DriverPayload<ExtArgs>;
            fields: Prisma.DriverFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DriverFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DriverFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>;
                };
                findFirst: {
                    args: Prisma.DriverFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DriverFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>;
                };
                findMany: {
                    args: Prisma.DriverFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>[];
                };
                create: {
                    args: Prisma.DriverCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>;
                };
                createMany: {
                    args: Prisma.DriverCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DriverCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>[];
                };
                delete: {
                    args: Prisma.DriverDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>;
                };
                update: {
                    args: Prisma.DriverUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>;
                };
                deleteMany: {
                    args: Prisma.DriverDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DriverUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DriverUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>[];
                };
                upsert: {
                    args: Prisma.DriverUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DriverPayload>;
                };
                aggregate: {
                    args: Prisma.DriverAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDriver>;
                };
                groupBy: {
                    args: Prisma.DriverGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DriverGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DriverCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DriverCountAggregateOutputType> | number;
                };
            };
        };
        Vehicle: {
            payload: Prisma.$VehiclePayload<ExtArgs>;
            fields: Prisma.VehicleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.VehicleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.VehicleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                findFirst: {
                    args: Prisma.VehicleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.VehicleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                findMany: {
                    args: Prisma.VehicleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>[];
                };
                create: {
                    args: Prisma.VehicleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                createMany: {
                    args: Prisma.VehicleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.VehicleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>[];
                };
                delete: {
                    args: Prisma.VehicleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                update: {
                    args: Prisma.VehicleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                deleteMany: {
                    args: Prisma.VehicleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.VehicleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.VehicleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>[];
                };
                upsert: {
                    args: Prisma.VehicleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VehiclePayload>;
                };
                aggregate: {
                    args: Prisma.VehicleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVehicle>;
                };
                groupBy: {
                    args: Prisma.VehicleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VehicleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.VehicleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VehicleCountAggregateOutputType> | number;
                };
            };
        };
        Delivery: {
            payload: Prisma.$DeliveryPayload<ExtArgs>;
            fields: Prisma.DeliveryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DeliveryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DeliveryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>;
                };
                findFirst: {
                    args: Prisma.DeliveryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DeliveryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>;
                };
                findMany: {
                    args: Prisma.DeliveryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>[];
                };
                create: {
                    args: Prisma.DeliveryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>;
                };
                createMany: {
                    args: Prisma.DeliveryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DeliveryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>[];
                };
                delete: {
                    args: Prisma.DeliveryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>;
                };
                update: {
                    args: Prisma.DeliveryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>;
                };
                deleteMany: {
                    args: Prisma.DeliveryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DeliveryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DeliveryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>[];
                };
                upsert: {
                    args: Prisma.DeliveryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DeliveryPayload>;
                };
                aggregate: {
                    args: Prisma.DeliveryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDelivery>;
                };
                groupBy: {
                    args: Prisma.DeliveryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DeliveryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DeliveryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DeliveryCountAggregateOutputType> | number;
                };
            };
        };
        Route: {
            payload: Prisma.$RoutePayload<ExtArgs>;
            fields: Prisma.RouteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RouteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RouteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>;
                };
                findFirst: {
                    args: Prisma.RouteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RouteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>;
                };
                findMany: {
                    args: Prisma.RouteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>[];
                };
                create: {
                    args: Prisma.RouteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>;
                };
                createMany: {
                    args: Prisma.RouteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RouteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>[];
                };
                delete: {
                    args: Prisma.RouteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>;
                };
                update: {
                    args: Prisma.RouteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>;
                };
                deleteMany: {
                    args: Prisma.RouteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RouteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RouteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>[];
                };
                upsert: {
                    args: Prisma.RouteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoutePayload>;
                };
                aggregate: {
                    args: Prisma.RouteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRoute>;
                };
                groupBy: {
                    args: Prisma.RouteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RouteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteCountAggregateOutputType> | number;
                };
            };
        };
        RouteStop: {
            payload: Prisma.$RouteStopPayload<ExtArgs>;
            fields: Prisma.RouteStopFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RouteStopFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RouteStopFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>;
                };
                findFirst: {
                    args: Prisma.RouteStopFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RouteStopFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>;
                };
                findMany: {
                    args: Prisma.RouteStopFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>[];
                };
                create: {
                    args: Prisma.RouteStopCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>;
                };
                createMany: {
                    args: Prisma.RouteStopCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RouteStopCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>[];
                };
                delete: {
                    args: Prisma.RouteStopDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>;
                };
                update: {
                    args: Prisma.RouteStopUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>;
                };
                deleteMany: {
                    args: Prisma.RouteStopDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RouteStopUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RouteStopUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>[];
                };
                upsert: {
                    args: Prisma.RouteStopUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteStopPayload>;
                };
                aggregate: {
                    args: Prisma.RouteStopAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRouteStop>;
                };
                groupBy: {
                    args: Prisma.RouteStopGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteStopGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RouteStopCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteStopCountAggregateOutputType> | number;
                };
            };
        };
        ProofOfDelivery: {
            payload: Prisma.$ProofOfDeliveryPayload<ExtArgs>;
            fields: Prisma.ProofOfDeliveryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProofOfDeliveryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProofOfDeliveryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>;
                };
                findFirst: {
                    args: Prisma.ProofOfDeliveryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProofOfDeliveryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>;
                };
                findMany: {
                    args: Prisma.ProofOfDeliveryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>[];
                };
                create: {
                    args: Prisma.ProofOfDeliveryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>;
                };
                createMany: {
                    args: Prisma.ProofOfDeliveryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProofOfDeliveryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>[];
                };
                delete: {
                    args: Prisma.ProofOfDeliveryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>;
                };
                update: {
                    args: Prisma.ProofOfDeliveryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>;
                };
                deleteMany: {
                    args: Prisma.ProofOfDeliveryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProofOfDeliveryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProofOfDeliveryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>[];
                };
                upsert: {
                    args: Prisma.ProofOfDeliveryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProofOfDeliveryPayload>;
                };
                aggregate: {
                    args: Prisma.ProofOfDeliveryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProofOfDelivery>;
                };
                groupBy: {
                    args: Prisma.ProofOfDeliveryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProofOfDeliveryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProofOfDeliveryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProofOfDeliveryCountAggregateOutputType> | number;
                };
            };
        };
        RouteEvent: {
            payload: Prisma.$RouteEventPayload<ExtArgs>;
            fields: Prisma.RouteEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RouteEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RouteEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>;
                };
                findFirst: {
                    args: Prisma.RouteEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RouteEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>;
                };
                findMany: {
                    args: Prisma.RouteEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>[];
                };
                create: {
                    args: Prisma.RouteEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>;
                };
                createMany: {
                    args: Prisma.RouteEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RouteEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>[];
                };
                delete: {
                    args: Prisma.RouteEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>;
                };
                update: {
                    args: Prisma.RouteEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>;
                };
                deleteMany: {
                    args: Prisma.RouteEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RouteEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RouteEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>[];
                };
                upsert: {
                    args: Prisma.RouteEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RouteEventPayload>;
                };
                aggregate: {
                    args: Prisma.RouteEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRouteEvent>;
                };
                groupBy: {
                    args: Prisma.RouteEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RouteEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RouteEventCountAggregateOutputType> | number;
                };
            };
        };
        OptimizationJob: {
            payload: Prisma.$OptimizationJobPayload<ExtArgs>;
            fields: Prisma.OptimizationJobFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OptimizationJobFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OptimizationJobFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>;
                };
                findFirst: {
                    args: Prisma.OptimizationJobFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OptimizationJobFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>;
                };
                findMany: {
                    args: Prisma.OptimizationJobFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>[];
                };
                create: {
                    args: Prisma.OptimizationJobCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>;
                };
                createMany: {
                    args: Prisma.OptimizationJobCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OptimizationJobCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>[];
                };
                delete: {
                    args: Prisma.OptimizationJobDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>;
                };
                update: {
                    args: Prisma.OptimizationJobUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>;
                };
                deleteMany: {
                    args: Prisma.OptimizationJobDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OptimizationJobUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OptimizationJobUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>[];
                };
                upsert: {
                    args: Prisma.OptimizationJobUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OptimizationJobPayload>;
                };
                aggregate: {
                    args: Prisma.OptimizationJobAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOptimizationJob>;
                };
                groupBy: {
                    args: Prisma.OptimizationJobGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OptimizationJobGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OptimizationJobCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OptimizationJobCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
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
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
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
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>;
export type EnumDriverStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DriverStatus'>;
export type ListEnumDriverStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DriverStatus[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumVehicleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VehicleStatus'>;
export type ListEnumVehicleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VehicleStatus[]'>;
export type EnumDeliveryPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryPriority'>;
export type ListEnumDeliveryPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryPriority[]'>;
export type EnumDeliveryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryStatus'>;
export type ListEnumDeliveryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryStatus[]'>;
export type EnumRouteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteStatus'>;
export type ListEnumRouteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteStatus[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumRouteStopStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteStopStatus'>;
export type ListEnumRouteStopStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteStopStatus[]'>;
export type EnumRouteEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteEventType'>;
export type ListEnumRouteEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RouteEventType[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumOptimizationJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OptimizationJobStatus'>;
export type ListEnumOptimizationJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OptimizationJobStatus[]'>;
export type EnumOptimizationObjectiveFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OptimizationObjective'>;
export type ListEnumOptimizationObjectiveFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OptimizationObjective[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    organization?: Prisma.OrganizationOmit;
    user?: Prisma.UserOmit;
    driver?: Prisma.DriverOmit;
    vehicle?: Prisma.VehicleOmit;
    delivery?: Prisma.DeliveryOmit;
    route?: Prisma.RouteOmit;
    routeStop?: Prisma.RouteStopOmit;
    proofOfDelivery?: Prisma.ProofOfDeliveryOmit;
    routeEvent?: Prisma.RouteEventOmit;
    optimizationJob?: Prisma.OptimizationJobOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
