import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RouteModel = runtime.Types.Result.DefaultSelection<Prisma.$RoutePayload>;
export type AggregateRoute = {
    _count: RouteCountAggregateOutputType | null;
    _avg: RouteAvgAggregateOutputType | null;
    _sum: RouteSumAggregateOutputType | null;
    _min: RouteMinAggregateOutputType | null;
    _max: RouteMaxAggregateOutputType | null;
};
export type RouteAvgAggregateOutputType = {
    totalDistanceMeters: number | null;
    totalDurationSeconds: number | null;
    capacityUsedKg: runtime.Decimal | null;
};
export type RouteSumAggregateOutputType = {
    totalDistanceMeters: number | null;
    totalDurationSeconds: number | null;
    capacityUsedKg: runtime.Decimal | null;
};
export type RouteMinAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    driverId: string | null;
    vehicleId: string | null;
    status: $Enums.RouteStatus | null;
    plannedDate: Date | null;
    totalDistanceMeters: number | null;
    totalDurationSeconds: number | null;
    capacityUsedKg: runtime.Decimal | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RouteMaxAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    driverId: string | null;
    vehicleId: string | null;
    status: $Enums.RouteStatus | null;
    plannedDate: Date | null;
    totalDistanceMeters: number | null;
    totalDurationSeconds: number | null;
    capacityUsedKg: runtime.Decimal | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RouteCountAggregateOutputType = {
    id: number;
    organizationId: number;
    driverId: number;
    vehicleId: number;
    status: number;
    plannedDate: number;
    totalDistanceMeters: number;
    totalDurationSeconds: number;
    capacityUsedKg: number;
    startedAt: number;
    finishedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type RouteAvgAggregateInputType = {
    totalDistanceMeters?: true;
    totalDurationSeconds?: true;
    capacityUsedKg?: true;
};
export type RouteSumAggregateInputType = {
    totalDistanceMeters?: true;
    totalDurationSeconds?: true;
    capacityUsedKg?: true;
};
export type RouteMinAggregateInputType = {
    id?: true;
    organizationId?: true;
    driverId?: true;
    vehicleId?: true;
    status?: true;
    plannedDate?: true;
    totalDistanceMeters?: true;
    totalDurationSeconds?: true;
    capacityUsedKg?: true;
    startedAt?: true;
    finishedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RouteMaxAggregateInputType = {
    id?: true;
    organizationId?: true;
    driverId?: true;
    vehicleId?: true;
    status?: true;
    plannedDate?: true;
    totalDistanceMeters?: true;
    totalDurationSeconds?: true;
    capacityUsedKg?: true;
    startedAt?: true;
    finishedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RouteCountAggregateInputType = {
    id?: true;
    organizationId?: true;
    driverId?: true;
    vehicleId?: true;
    status?: true;
    plannedDate?: true;
    totalDistanceMeters?: true;
    totalDurationSeconds?: true;
    capacityUsedKg?: true;
    startedAt?: true;
    finishedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type RouteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteWhereInput;
    orderBy?: Prisma.RouteOrderByWithRelationInput | Prisma.RouteOrderByWithRelationInput[];
    cursor?: Prisma.RouteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RouteCountAggregateInputType;
    _avg?: RouteAvgAggregateInputType;
    _sum?: RouteSumAggregateInputType;
    _min?: RouteMinAggregateInputType;
    _max?: RouteMaxAggregateInputType;
};
export type GetRouteAggregateType<T extends RouteAggregateArgs> = {
    [P in keyof T & keyof AggregateRoute]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRoute[P]> : Prisma.GetScalarType<T[P], AggregateRoute[P]>;
};
export type RouteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteWhereInput;
    orderBy?: Prisma.RouteOrderByWithAggregationInput | Prisma.RouteOrderByWithAggregationInput[];
    by: Prisma.RouteScalarFieldEnum[] | Prisma.RouteScalarFieldEnum;
    having?: Prisma.RouteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RouteCountAggregateInputType | true;
    _avg?: RouteAvgAggregateInputType;
    _sum?: RouteSumAggregateInputType;
    _min?: RouteMinAggregateInputType;
    _max?: RouteMaxAggregateInputType;
};
export type RouteGroupByOutputType = {
    id: string;
    organizationId: string;
    driverId: string | null;
    vehicleId: string | null;
    status: $Enums.RouteStatus;
    plannedDate: Date;
    totalDistanceMeters: number | null;
    totalDurationSeconds: number | null;
    capacityUsedKg: runtime.Decimal | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: RouteCountAggregateOutputType | null;
    _avg: RouteAvgAggregateOutputType | null;
    _sum: RouteSumAggregateOutputType | null;
    _min: RouteMinAggregateOutputType | null;
    _max: RouteMaxAggregateOutputType | null;
};
export type GetRouteGroupByPayload<T extends RouteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RouteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RouteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RouteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RouteGroupByOutputType[P]>;
}>>;
export type RouteWhereInput = {
    AND?: Prisma.RouteWhereInput | Prisma.RouteWhereInput[];
    OR?: Prisma.RouteWhereInput[];
    NOT?: Prisma.RouteWhereInput | Prisma.RouteWhereInput[];
    id?: Prisma.StringFilter<"Route"> | string;
    organizationId?: Prisma.StringFilter<"Route"> | string;
    driverId?: Prisma.StringNullableFilter<"Route"> | string | null;
    vehicleId?: Prisma.StringNullableFilter<"Route"> | string | null;
    status?: Prisma.EnumRouteStatusFilter<"Route"> | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFilter<"Route"> | Date | string;
    totalDistanceMeters?: Prisma.IntNullableFilter<"Route"> | number | null;
    totalDurationSeconds?: Prisma.IntNullableFilter<"Route"> | number | null;
    capacityUsedKg?: Prisma.DecimalNullableFilter<"Route"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"Route"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableFilter<"Route"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Route"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Route"> | Date | string;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    driver?: Prisma.XOR<Prisma.DriverNullableScalarRelationFilter, Prisma.DriverWhereInput> | null;
    vehicle?: Prisma.XOR<Prisma.VehicleNullableScalarRelationFilter, Prisma.VehicleWhereInput> | null;
    activeDriver?: Prisma.XOR<Prisma.DriverNullableScalarRelationFilter, Prisma.DriverWhereInput> | null;
    stops?: Prisma.RouteStopListRelationFilter;
    events?: Prisma.RouteEventListRelationFilter;
};
export type RouteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    driverId?: Prisma.SortOrderInput | Prisma.SortOrder;
    vehicleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    totalDistanceMeters?: Prisma.SortOrderInput | Prisma.SortOrder;
    totalDurationSeconds?: Prisma.SortOrderInput | Prisma.SortOrder;
    capacityUsedKg?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    finishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    organization?: Prisma.OrganizationOrderByWithRelationInput;
    driver?: Prisma.DriverOrderByWithRelationInput;
    vehicle?: Prisma.VehicleOrderByWithRelationInput;
    activeDriver?: Prisma.DriverOrderByWithRelationInput;
    stops?: Prisma.RouteStopOrderByRelationAggregateInput;
    events?: Prisma.RouteEventOrderByRelationAggregateInput;
};
export type RouteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RouteWhereInput | Prisma.RouteWhereInput[];
    OR?: Prisma.RouteWhereInput[];
    NOT?: Prisma.RouteWhereInput | Prisma.RouteWhereInput[];
    organizationId?: Prisma.StringFilter<"Route"> | string;
    driverId?: Prisma.StringNullableFilter<"Route"> | string | null;
    vehicleId?: Prisma.StringNullableFilter<"Route"> | string | null;
    status?: Prisma.EnumRouteStatusFilter<"Route"> | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFilter<"Route"> | Date | string;
    totalDistanceMeters?: Prisma.IntNullableFilter<"Route"> | number | null;
    totalDurationSeconds?: Prisma.IntNullableFilter<"Route"> | number | null;
    capacityUsedKg?: Prisma.DecimalNullableFilter<"Route"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"Route"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableFilter<"Route"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Route"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Route"> | Date | string;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    driver?: Prisma.XOR<Prisma.DriverNullableScalarRelationFilter, Prisma.DriverWhereInput> | null;
    vehicle?: Prisma.XOR<Prisma.VehicleNullableScalarRelationFilter, Prisma.VehicleWhereInput> | null;
    activeDriver?: Prisma.XOR<Prisma.DriverNullableScalarRelationFilter, Prisma.DriverWhereInput> | null;
    stops?: Prisma.RouteStopListRelationFilter;
    events?: Prisma.RouteEventListRelationFilter;
}, "id">;
export type RouteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    driverId?: Prisma.SortOrderInput | Prisma.SortOrder;
    vehicleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    totalDistanceMeters?: Prisma.SortOrderInput | Prisma.SortOrder;
    totalDurationSeconds?: Prisma.SortOrderInput | Prisma.SortOrder;
    capacityUsedKg?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    finishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RouteCountOrderByAggregateInput;
    _avg?: Prisma.RouteAvgOrderByAggregateInput;
    _max?: Prisma.RouteMaxOrderByAggregateInput;
    _min?: Prisma.RouteMinOrderByAggregateInput;
    _sum?: Prisma.RouteSumOrderByAggregateInput;
};
export type RouteScalarWhereWithAggregatesInput = {
    AND?: Prisma.RouteScalarWhereWithAggregatesInput | Prisma.RouteScalarWhereWithAggregatesInput[];
    OR?: Prisma.RouteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RouteScalarWhereWithAggregatesInput | Prisma.RouteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Route"> | string;
    organizationId?: Prisma.StringWithAggregatesFilter<"Route"> | string;
    driverId?: Prisma.StringNullableWithAggregatesFilter<"Route"> | string | null;
    vehicleId?: Prisma.StringNullableWithAggregatesFilter<"Route"> | string | null;
    status?: Prisma.EnumRouteStatusWithAggregatesFilter<"Route"> | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeWithAggregatesFilter<"Route"> | Date | string;
    totalDistanceMeters?: Prisma.IntNullableWithAggregatesFilter<"Route"> | number | null;
    totalDurationSeconds?: Prisma.IntNullableWithAggregatesFilter<"Route"> | number | null;
    capacityUsedKg?: Prisma.DecimalNullableWithAggregatesFilter<"Route"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Route"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Route"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Route"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Route"> | Date | string;
};
export type RouteCreateInput = {
    id?: string;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutRoutesInput;
    driver?: Prisma.DriverCreateNestedOneWithoutRoutesInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutRoutesInput;
    activeDriver?: Prisma.DriverCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventCreateNestedManyWithoutRouteInput;
};
export type RouteUncheckedCreateInput = {
    id?: string;
    organizationId: string;
    driverId?: string | null;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    activeDriver?: Prisma.DriverUncheckedCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopUncheckedCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventUncheckedCreateNestedManyWithoutRouteInput;
};
export type RouteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRoutesNestedInput;
    driver?: Prisma.DriverUpdateOneWithoutRoutesNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutRoutesNestedInput;
    activeDriver?: Prisma.DriverUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    activeDriver?: Prisma.DriverUncheckedUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUncheckedUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUncheckedUpdateManyWithoutRouteNestedInput;
};
export type RouteCreateManyInput = {
    id?: string;
    organizationId: string;
    driverId?: string | null;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RouteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteListRelationFilter = {
    every?: Prisma.RouteWhereInput;
    some?: Prisma.RouteWhereInput;
    none?: Prisma.RouteWhereInput;
};
export type RouteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RouteNullableScalarRelationFilter = {
    is?: Prisma.RouteWhereInput | null;
    isNot?: Prisma.RouteWhereInput | null;
};
export type RouteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    driverId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    totalDistanceMeters?: Prisma.SortOrder;
    totalDurationSeconds?: Prisma.SortOrder;
    capacityUsedKg?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RouteAvgOrderByAggregateInput = {
    totalDistanceMeters?: Prisma.SortOrder;
    totalDurationSeconds?: Prisma.SortOrder;
    capacityUsedKg?: Prisma.SortOrder;
};
export type RouteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    driverId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    totalDistanceMeters?: Prisma.SortOrder;
    totalDurationSeconds?: Prisma.SortOrder;
    capacityUsedKg?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RouteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    driverId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    totalDistanceMeters?: Prisma.SortOrder;
    totalDurationSeconds?: Prisma.SortOrder;
    capacityUsedKg?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RouteSumOrderByAggregateInput = {
    totalDistanceMeters?: Prisma.SortOrder;
    totalDurationSeconds?: Prisma.SortOrder;
    capacityUsedKg?: Prisma.SortOrder;
};
export type RouteScalarRelationFilter = {
    is?: Prisma.RouteWhereInput;
    isNot?: Prisma.RouteWhereInput;
};
export type RouteCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutOrganizationInput, Prisma.RouteUncheckedCreateWithoutOrganizationInput> | Prisma.RouteCreateWithoutOrganizationInput[] | Prisma.RouteUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutOrganizationInput | Prisma.RouteCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.RouteCreateManyOrganizationInputEnvelope;
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
};
export type RouteUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutOrganizationInput, Prisma.RouteUncheckedCreateWithoutOrganizationInput> | Prisma.RouteCreateWithoutOrganizationInput[] | Prisma.RouteUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutOrganizationInput | Prisma.RouteCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.RouteCreateManyOrganizationInputEnvelope;
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
};
export type RouteUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutOrganizationInput, Prisma.RouteUncheckedCreateWithoutOrganizationInput> | Prisma.RouteCreateWithoutOrganizationInput[] | Prisma.RouteUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutOrganizationInput | Prisma.RouteCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.RouteUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.RouteUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.RouteCreateManyOrganizationInputEnvelope;
    set?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    disconnect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    delete?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    update?: Prisma.RouteUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.RouteUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.RouteUpdateManyWithWhereWithoutOrganizationInput | Prisma.RouteUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.RouteScalarWhereInput | Prisma.RouteScalarWhereInput[];
};
export type RouteUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutOrganizationInput, Prisma.RouteUncheckedCreateWithoutOrganizationInput> | Prisma.RouteCreateWithoutOrganizationInput[] | Prisma.RouteUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutOrganizationInput | Prisma.RouteCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.RouteUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.RouteUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.RouteCreateManyOrganizationInputEnvelope;
    set?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    disconnect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    delete?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    update?: Prisma.RouteUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.RouteUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.RouteUpdateManyWithWhereWithoutOrganizationInput | Prisma.RouteUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.RouteScalarWhereInput | Prisma.RouteScalarWhereInput[];
};
export type RouteCreateNestedOneWithoutActiveDriverInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutActiveDriverInput, Prisma.RouteUncheckedCreateWithoutActiveDriverInput>;
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutActiveDriverInput;
    connect?: Prisma.RouteWhereUniqueInput;
};
export type RouteCreateNestedManyWithoutDriverInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutDriverInput, Prisma.RouteUncheckedCreateWithoutDriverInput> | Prisma.RouteCreateWithoutDriverInput[] | Prisma.RouteUncheckedCreateWithoutDriverInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutDriverInput | Prisma.RouteCreateOrConnectWithoutDriverInput[];
    createMany?: Prisma.RouteCreateManyDriverInputEnvelope;
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
};
export type RouteUncheckedCreateNestedManyWithoutDriverInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutDriverInput, Prisma.RouteUncheckedCreateWithoutDriverInput> | Prisma.RouteCreateWithoutDriverInput[] | Prisma.RouteUncheckedCreateWithoutDriverInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutDriverInput | Prisma.RouteCreateOrConnectWithoutDriverInput[];
    createMany?: Prisma.RouteCreateManyDriverInputEnvelope;
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
};
export type RouteUpdateOneWithoutActiveDriverNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutActiveDriverInput, Prisma.RouteUncheckedCreateWithoutActiveDriverInput>;
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutActiveDriverInput;
    upsert?: Prisma.RouteUpsertWithoutActiveDriverInput;
    disconnect?: Prisma.RouteWhereInput | boolean;
    delete?: Prisma.RouteWhereInput | boolean;
    connect?: Prisma.RouteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RouteUpdateToOneWithWhereWithoutActiveDriverInput, Prisma.RouteUpdateWithoutActiveDriverInput>, Prisma.RouteUncheckedUpdateWithoutActiveDriverInput>;
};
export type RouteUpdateManyWithoutDriverNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutDriverInput, Prisma.RouteUncheckedCreateWithoutDriverInput> | Prisma.RouteCreateWithoutDriverInput[] | Prisma.RouteUncheckedCreateWithoutDriverInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutDriverInput | Prisma.RouteCreateOrConnectWithoutDriverInput[];
    upsert?: Prisma.RouteUpsertWithWhereUniqueWithoutDriverInput | Prisma.RouteUpsertWithWhereUniqueWithoutDriverInput[];
    createMany?: Prisma.RouteCreateManyDriverInputEnvelope;
    set?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    disconnect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    delete?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    update?: Prisma.RouteUpdateWithWhereUniqueWithoutDriverInput | Prisma.RouteUpdateWithWhereUniqueWithoutDriverInput[];
    updateMany?: Prisma.RouteUpdateManyWithWhereWithoutDriverInput | Prisma.RouteUpdateManyWithWhereWithoutDriverInput[];
    deleteMany?: Prisma.RouteScalarWhereInput | Prisma.RouteScalarWhereInput[];
};
export type RouteUncheckedUpdateManyWithoutDriverNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutDriverInput, Prisma.RouteUncheckedCreateWithoutDriverInput> | Prisma.RouteCreateWithoutDriverInput[] | Prisma.RouteUncheckedCreateWithoutDriverInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutDriverInput | Prisma.RouteCreateOrConnectWithoutDriverInput[];
    upsert?: Prisma.RouteUpsertWithWhereUniqueWithoutDriverInput | Prisma.RouteUpsertWithWhereUniqueWithoutDriverInput[];
    createMany?: Prisma.RouteCreateManyDriverInputEnvelope;
    set?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    disconnect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    delete?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    update?: Prisma.RouteUpdateWithWhereUniqueWithoutDriverInput | Prisma.RouteUpdateWithWhereUniqueWithoutDriverInput[];
    updateMany?: Prisma.RouteUpdateManyWithWhereWithoutDriverInput | Prisma.RouteUpdateManyWithWhereWithoutDriverInput[];
    deleteMany?: Prisma.RouteScalarWhereInput | Prisma.RouteScalarWhereInput[];
};
export type RouteCreateNestedManyWithoutVehicleInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutVehicleInput, Prisma.RouteUncheckedCreateWithoutVehicleInput> | Prisma.RouteCreateWithoutVehicleInput[] | Prisma.RouteUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutVehicleInput | Prisma.RouteCreateOrConnectWithoutVehicleInput[];
    createMany?: Prisma.RouteCreateManyVehicleInputEnvelope;
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
};
export type RouteUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutVehicleInput, Prisma.RouteUncheckedCreateWithoutVehicleInput> | Prisma.RouteCreateWithoutVehicleInput[] | Prisma.RouteUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutVehicleInput | Prisma.RouteCreateOrConnectWithoutVehicleInput[];
    createMany?: Prisma.RouteCreateManyVehicleInputEnvelope;
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
};
export type RouteUpdateManyWithoutVehicleNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutVehicleInput, Prisma.RouteUncheckedCreateWithoutVehicleInput> | Prisma.RouteCreateWithoutVehicleInput[] | Prisma.RouteUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutVehicleInput | Prisma.RouteCreateOrConnectWithoutVehicleInput[];
    upsert?: Prisma.RouteUpsertWithWhereUniqueWithoutVehicleInput | Prisma.RouteUpsertWithWhereUniqueWithoutVehicleInput[];
    createMany?: Prisma.RouteCreateManyVehicleInputEnvelope;
    set?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    disconnect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    delete?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    update?: Prisma.RouteUpdateWithWhereUniqueWithoutVehicleInput | Prisma.RouteUpdateWithWhereUniqueWithoutVehicleInput[];
    updateMany?: Prisma.RouteUpdateManyWithWhereWithoutVehicleInput | Prisma.RouteUpdateManyWithWhereWithoutVehicleInput[];
    deleteMany?: Prisma.RouteScalarWhereInput | Prisma.RouteScalarWhereInput[];
};
export type RouteUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutVehicleInput, Prisma.RouteUncheckedCreateWithoutVehicleInput> | Prisma.RouteCreateWithoutVehicleInput[] | Prisma.RouteUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutVehicleInput | Prisma.RouteCreateOrConnectWithoutVehicleInput[];
    upsert?: Prisma.RouteUpsertWithWhereUniqueWithoutVehicleInput | Prisma.RouteUpsertWithWhereUniqueWithoutVehicleInput[];
    createMany?: Prisma.RouteCreateManyVehicleInputEnvelope;
    set?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    disconnect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    delete?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    connect?: Prisma.RouteWhereUniqueInput | Prisma.RouteWhereUniqueInput[];
    update?: Prisma.RouteUpdateWithWhereUniqueWithoutVehicleInput | Prisma.RouteUpdateWithWhereUniqueWithoutVehicleInput[];
    updateMany?: Prisma.RouteUpdateManyWithWhereWithoutVehicleInput | Prisma.RouteUpdateManyWithWhereWithoutVehicleInput[];
    deleteMany?: Prisma.RouteScalarWhereInput | Prisma.RouteScalarWhereInput[];
};
export type EnumRouteStatusFieldUpdateOperationsInput = {
    set?: $Enums.RouteStatus;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type RouteCreateNestedOneWithoutStopsInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutStopsInput, Prisma.RouteUncheckedCreateWithoutStopsInput>;
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutStopsInput;
    connect?: Prisma.RouteWhereUniqueInput;
};
export type RouteUpdateOneRequiredWithoutStopsNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutStopsInput, Prisma.RouteUncheckedCreateWithoutStopsInput>;
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutStopsInput;
    upsert?: Prisma.RouteUpsertWithoutStopsInput;
    connect?: Prisma.RouteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RouteUpdateToOneWithWhereWithoutStopsInput, Prisma.RouteUpdateWithoutStopsInput>, Prisma.RouteUncheckedUpdateWithoutStopsInput>;
};
export type RouteCreateNestedOneWithoutEventsInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutEventsInput, Prisma.RouteUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutEventsInput;
    connect?: Prisma.RouteWhereUniqueInput;
};
export type RouteUpdateOneRequiredWithoutEventsNestedInput = {
    create?: Prisma.XOR<Prisma.RouteCreateWithoutEventsInput, Prisma.RouteUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.RouteCreateOrConnectWithoutEventsInput;
    upsert?: Prisma.RouteUpsertWithoutEventsInput;
    connect?: Prisma.RouteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RouteUpdateToOneWithWhereWithoutEventsInput, Prisma.RouteUpdateWithoutEventsInput>, Prisma.RouteUncheckedUpdateWithoutEventsInput>;
};
export type RouteCreateWithoutOrganizationInput = {
    id?: string;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    driver?: Prisma.DriverCreateNestedOneWithoutRoutesInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutRoutesInput;
    activeDriver?: Prisma.DriverCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventCreateNestedManyWithoutRouteInput;
};
export type RouteUncheckedCreateWithoutOrganizationInput = {
    id?: string;
    driverId?: string | null;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    activeDriver?: Prisma.DriverUncheckedCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopUncheckedCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventUncheckedCreateNestedManyWithoutRouteInput;
};
export type RouteCreateOrConnectWithoutOrganizationInput = {
    where: Prisma.RouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteCreateWithoutOrganizationInput, Prisma.RouteUncheckedCreateWithoutOrganizationInput>;
};
export type RouteCreateManyOrganizationInputEnvelope = {
    data: Prisma.RouteCreateManyOrganizationInput | Prisma.RouteCreateManyOrganizationInput[];
    skipDuplicates?: boolean;
};
export type RouteUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.RouteWhereUniqueInput;
    update: Prisma.XOR<Prisma.RouteUpdateWithoutOrganizationInput, Prisma.RouteUncheckedUpdateWithoutOrganizationInput>;
    create: Prisma.XOR<Prisma.RouteCreateWithoutOrganizationInput, Prisma.RouteUncheckedCreateWithoutOrganizationInput>;
};
export type RouteUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.RouteWhereUniqueInput;
    data: Prisma.XOR<Prisma.RouteUpdateWithoutOrganizationInput, Prisma.RouteUncheckedUpdateWithoutOrganizationInput>;
};
export type RouteUpdateManyWithWhereWithoutOrganizationInput = {
    where: Prisma.RouteScalarWhereInput;
    data: Prisma.XOR<Prisma.RouteUpdateManyMutationInput, Prisma.RouteUncheckedUpdateManyWithoutOrganizationInput>;
};
export type RouteScalarWhereInput = {
    AND?: Prisma.RouteScalarWhereInput | Prisma.RouteScalarWhereInput[];
    OR?: Prisma.RouteScalarWhereInput[];
    NOT?: Prisma.RouteScalarWhereInput | Prisma.RouteScalarWhereInput[];
    id?: Prisma.StringFilter<"Route"> | string;
    organizationId?: Prisma.StringFilter<"Route"> | string;
    driverId?: Prisma.StringNullableFilter<"Route"> | string | null;
    vehicleId?: Prisma.StringNullableFilter<"Route"> | string | null;
    status?: Prisma.EnumRouteStatusFilter<"Route"> | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFilter<"Route"> | Date | string;
    totalDistanceMeters?: Prisma.IntNullableFilter<"Route"> | number | null;
    totalDurationSeconds?: Prisma.IntNullableFilter<"Route"> | number | null;
    capacityUsedKg?: Prisma.DecimalNullableFilter<"Route"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"Route"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableFilter<"Route"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Route"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Route"> | Date | string;
};
export type RouteCreateWithoutActiveDriverInput = {
    id?: string;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutRoutesInput;
    driver?: Prisma.DriverCreateNestedOneWithoutRoutesInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutRoutesInput;
    stops?: Prisma.RouteStopCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventCreateNestedManyWithoutRouteInput;
};
export type RouteUncheckedCreateWithoutActiveDriverInput = {
    id?: string;
    organizationId: string;
    driverId?: string | null;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stops?: Prisma.RouteStopUncheckedCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventUncheckedCreateNestedManyWithoutRouteInput;
};
export type RouteCreateOrConnectWithoutActiveDriverInput = {
    where: Prisma.RouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteCreateWithoutActiveDriverInput, Prisma.RouteUncheckedCreateWithoutActiveDriverInput>;
};
export type RouteCreateWithoutDriverInput = {
    id?: string;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutRoutesInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutRoutesInput;
    activeDriver?: Prisma.DriverCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventCreateNestedManyWithoutRouteInput;
};
export type RouteUncheckedCreateWithoutDriverInput = {
    id?: string;
    organizationId: string;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    activeDriver?: Prisma.DriverUncheckedCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopUncheckedCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventUncheckedCreateNestedManyWithoutRouteInput;
};
export type RouteCreateOrConnectWithoutDriverInput = {
    where: Prisma.RouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteCreateWithoutDriverInput, Prisma.RouteUncheckedCreateWithoutDriverInput>;
};
export type RouteCreateManyDriverInputEnvelope = {
    data: Prisma.RouteCreateManyDriverInput | Prisma.RouteCreateManyDriverInput[];
    skipDuplicates?: boolean;
};
export type RouteUpsertWithoutActiveDriverInput = {
    update: Prisma.XOR<Prisma.RouteUpdateWithoutActiveDriverInput, Prisma.RouteUncheckedUpdateWithoutActiveDriverInput>;
    create: Prisma.XOR<Prisma.RouteCreateWithoutActiveDriverInput, Prisma.RouteUncheckedCreateWithoutActiveDriverInput>;
    where?: Prisma.RouteWhereInput;
};
export type RouteUpdateToOneWithWhereWithoutActiveDriverInput = {
    where?: Prisma.RouteWhereInput;
    data: Prisma.XOR<Prisma.RouteUpdateWithoutActiveDriverInput, Prisma.RouteUncheckedUpdateWithoutActiveDriverInput>;
};
export type RouteUpdateWithoutActiveDriverInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRoutesNestedInput;
    driver?: Prisma.DriverUpdateOneWithoutRoutesNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutRoutesNestedInput;
    stops?: Prisma.RouteStopUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateWithoutActiveDriverInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stops?: Prisma.RouteStopUncheckedUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUncheckedUpdateManyWithoutRouteNestedInput;
};
export type RouteUpsertWithWhereUniqueWithoutDriverInput = {
    where: Prisma.RouteWhereUniqueInput;
    update: Prisma.XOR<Prisma.RouteUpdateWithoutDriverInput, Prisma.RouteUncheckedUpdateWithoutDriverInput>;
    create: Prisma.XOR<Prisma.RouteCreateWithoutDriverInput, Prisma.RouteUncheckedCreateWithoutDriverInput>;
};
export type RouteUpdateWithWhereUniqueWithoutDriverInput = {
    where: Prisma.RouteWhereUniqueInput;
    data: Prisma.XOR<Prisma.RouteUpdateWithoutDriverInput, Prisma.RouteUncheckedUpdateWithoutDriverInput>;
};
export type RouteUpdateManyWithWhereWithoutDriverInput = {
    where: Prisma.RouteScalarWhereInput;
    data: Prisma.XOR<Prisma.RouteUpdateManyMutationInput, Prisma.RouteUncheckedUpdateManyWithoutDriverInput>;
};
export type RouteCreateWithoutVehicleInput = {
    id?: string;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutRoutesInput;
    driver?: Prisma.DriverCreateNestedOneWithoutRoutesInput;
    activeDriver?: Prisma.DriverCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventCreateNestedManyWithoutRouteInput;
};
export type RouteUncheckedCreateWithoutVehicleInput = {
    id?: string;
    organizationId: string;
    driverId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    activeDriver?: Prisma.DriverUncheckedCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopUncheckedCreateNestedManyWithoutRouteInput;
    events?: Prisma.RouteEventUncheckedCreateNestedManyWithoutRouteInput;
};
export type RouteCreateOrConnectWithoutVehicleInput = {
    where: Prisma.RouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteCreateWithoutVehicleInput, Prisma.RouteUncheckedCreateWithoutVehicleInput>;
};
export type RouteCreateManyVehicleInputEnvelope = {
    data: Prisma.RouteCreateManyVehicleInput | Prisma.RouteCreateManyVehicleInput[];
    skipDuplicates?: boolean;
};
export type RouteUpsertWithWhereUniqueWithoutVehicleInput = {
    where: Prisma.RouteWhereUniqueInput;
    update: Prisma.XOR<Prisma.RouteUpdateWithoutVehicleInput, Prisma.RouteUncheckedUpdateWithoutVehicleInput>;
    create: Prisma.XOR<Prisma.RouteCreateWithoutVehicleInput, Prisma.RouteUncheckedCreateWithoutVehicleInput>;
};
export type RouteUpdateWithWhereUniqueWithoutVehicleInput = {
    where: Prisma.RouteWhereUniqueInput;
    data: Prisma.XOR<Prisma.RouteUpdateWithoutVehicleInput, Prisma.RouteUncheckedUpdateWithoutVehicleInput>;
};
export type RouteUpdateManyWithWhereWithoutVehicleInput = {
    where: Prisma.RouteScalarWhereInput;
    data: Prisma.XOR<Prisma.RouteUpdateManyMutationInput, Prisma.RouteUncheckedUpdateManyWithoutVehicleInput>;
};
export type RouteCreateWithoutStopsInput = {
    id?: string;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutRoutesInput;
    driver?: Prisma.DriverCreateNestedOneWithoutRoutesInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutRoutesInput;
    activeDriver?: Prisma.DriverCreateNestedOneWithoutActiveRouteInput;
    events?: Prisma.RouteEventCreateNestedManyWithoutRouteInput;
};
export type RouteUncheckedCreateWithoutStopsInput = {
    id?: string;
    organizationId: string;
    driverId?: string | null;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    activeDriver?: Prisma.DriverUncheckedCreateNestedOneWithoutActiveRouteInput;
    events?: Prisma.RouteEventUncheckedCreateNestedManyWithoutRouteInput;
};
export type RouteCreateOrConnectWithoutStopsInput = {
    where: Prisma.RouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteCreateWithoutStopsInput, Prisma.RouteUncheckedCreateWithoutStopsInput>;
};
export type RouteUpsertWithoutStopsInput = {
    update: Prisma.XOR<Prisma.RouteUpdateWithoutStopsInput, Prisma.RouteUncheckedUpdateWithoutStopsInput>;
    create: Prisma.XOR<Prisma.RouteCreateWithoutStopsInput, Prisma.RouteUncheckedCreateWithoutStopsInput>;
    where?: Prisma.RouteWhereInput;
};
export type RouteUpdateToOneWithWhereWithoutStopsInput = {
    where?: Prisma.RouteWhereInput;
    data: Prisma.XOR<Prisma.RouteUpdateWithoutStopsInput, Prisma.RouteUncheckedUpdateWithoutStopsInput>;
};
export type RouteUpdateWithoutStopsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRoutesNestedInput;
    driver?: Prisma.DriverUpdateOneWithoutRoutesNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutRoutesNestedInput;
    activeDriver?: Prisma.DriverUpdateOneWithoutActiveRouteNestedInput;
    events?: Prisma.RouteEventUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateWithoutStopsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    activeDriver?: Prisma.DriverUncheckedUpdateOneWithoutActiveRouteNestedInput;
    events?: Prisma.RouteEventUncheckedUpdateManyWithoutRouteNestedInput;
};
export type RouteCreateWithoutEventsInput = {
    id?: string;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutRoutesInput;
    driver?: Prisma.DriverCreateNestedOneWithoutRoutesInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutRoutesInput;
    activeDriver?: Prisma.DriverCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopCreateNestedManyWithoutRouteInput;
};
export type RouteUncheckedCreateWithoutEventsInput = {
    id?: string;
    organizationId: string;
    driverId?: string | null;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    activeDriver?: Prisma.DriverUncheckedCreateNestedOneWithoutActiveRouteInput;
    stops?: Prisma.RouteStopUncheckedCreateNestedManyWithoutRouteInput;
};
export type RouteCreateOrConnectWithoutEventsInput = {
    where: Prisma.RouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteCreateWithoutEventsInput, Prisma.RouteUncheckedCreateWithoutEventsInput>;
};
export type RouteUpsertWithoutEventsInput = {
    update: Prisma.XOR<Prisma.RouteUpdateWithoutEventsInput, Prisma.RouteUncheckedUpdateWithoutEventsInput>;
    create: Prisma.XOR<Prisma.RouteCreateWithoutEventsInput, Prisma.RouteUncheckedCreateWithoutEventsInput>;
    where?: Prisma.RouteWhereInput;
};
export type RouteUpdateToOneWithWhereWithoutEventsInput = {
    where?: Prisma.RouteWhereInput;
    data: Prisma.XOR<Prisma.RouteUpdateWithoutEventsInput, Prisma.RouteUncheckedUpdateWithoutEventsInput>;
};
export type RouteUpdateWithoutEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRoutesNestedInput;
    driver?: Prisma.DriverUpdateOneWithoutRoutesNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutRoutesNestedInput;
    activeDriver?: Prisma.DriverUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateWithoutEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    activeDriver?: Prisma.DriverUncheckedUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUncheckedUpdateManyWithoutRouteNestedInput;
};
export type RouteCreateManyOrganizationInput = {
    id?: string;
    driverId?: string | null;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RouteUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    driver?: Prisma.DriverUpdateOneWithoutRoutesNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutRoutesNestedInput;
    activeDriver?: Prisma.DriverUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    activeDriver?: Prisma.DriverUncheckedUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUncheckedUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUncheckedUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateManyWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteCreateManyDriverInput = {
    id?: string;
    organizationId: string;
    vehicleId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RouteUpdateWithoutDriverInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRoutesNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutRoutesNestedInput;
    activeDriver?: Prisma.DriverUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateWithoutDriverInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    activeDriver?: Prisma.DriverUncheckedUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUncheckedUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUncheckedUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateManyWithoutDriverInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteCreateManyVehicleInput = {
    id?: string;
    organizationId: string;
    driverId?: string | null;
    status?: $Enums.RouteStatus;
    plannedDate: Date | string;
    totalDistanceMeters?: number | null;
    totalDurationSeconds?: number | null;
    capacityUsedKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RouteUpdateWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRoutesNestedInput;
    driver?: Prisma.DriverUpdateOneWithoutRoutesNestedInput;
    activeDriver?: Prisma.DriverUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    activeDriver?: Prisma.DriverUncheckedUpdateOneWithoutActiveRouteNestedInput;
    stops?: Prisma.RouteStopUncheckedUpdateManyWithoutRouteNestedInput;
    events?: Prisma.RouteEventUncheckedUpdateManyWithoutRouteNestedInput;
};
export type RouteUncheckedUpdateManyWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    driverId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumRouteStatusFieldUpdateOperationsInput | $Enums.RouteStatus;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalDistanceMeters?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalDurationSeconds?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    capacityUsedKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteCountOutputType = {
    stops: number;
    events: number;
};
export type RouteCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stops?: boolean | RouteCountOutputTypeCountStopsArgs;
    events?: boolean | RouteCountOutputTypeCountEventsArgs;
};
export type RouteCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteCountOutputTypeSelect<ExtArgs> | null;
};
export type RouteCountOutputTypeCountStopsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteStopWhereInput;
};
export type RouteCountOutputTypeCountEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteEventWhereInput;
};
export type RouteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    driverId?: boolean;
    vehicleId?: boolean;
    status?: boolean;
    plannedDate?: boolean;
    totalDistanceMeters?: boolean;
    totalDurationSeconds?: boolean;
    capacityUsedKg?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    driver?: boolean | Prisma.Route$driverArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Route$vehicleArgs<ExtArgs>;
    activeDriver?: boolean | Prisma.Route$activeDriverArgs<ExtArgs>;
    stops?: boolean | Prisma.Route$stopsArgs<ExtArgs>;
    events?: boolean | Prisma.Route$eventsArgs<ExtArgs>;
    _count?: boolean | Prisma.RouteCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["route"]>;
export type RouteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    driverId?: boolean;
    vehicleId?: boolean;
    status?: boolean;
    plannedDate?: boolean;
    totalDistanceMeters?: boolean;
    totalDurationSeconds?: boolean;
    capacityUsedKg?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    driver?: boolean | Prisma.Route$driverArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Route$vehicleArgs<ExtArgs>;
}, ExtArgs["result"]["route"]>;
export type RouteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    driverId?: boolean;
    vehicleId?: boolean;
    status?: boolean;
    plannedDate?: boolean;
    totalDistanceMeters?: boolean;
    totalDurationSeconds?: boolean;
    capacityUsedKg?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    driver?: boolean | Prisma.Route$driverArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Route$vehicleArgs<ExtArgs>;
}, ExtArgs["result"]["route"]>;
export type RouteSelectScalar = {
    id?: boolean;
    organizationId?: boolean;
    driverId?: boolean;
    vehicleId?: boolean;
    status?: boolean;
    plannedDate?: boolean;
    totalDistanceMeters?: boolean;
    totalDurationSeconds?: boolean;
    capacityUsedKg?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type RouteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "organizationId" | "driverId" | "vehicleId" | "status" | "plannedDate" | "totalDistanceMeters" | "totalDurationSeconds" | "capacityUsedKg" | "startedAt" | "finishedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["route"]>;
export type RouteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    driver?: boolean | Prisma.Route$driverArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Route$vehicleArgs<ExtArgs>;
    activeDriver?: boolean | Prisma.Route$activeDriverArgs<ExtArgs>;
    stops?: boolean | Prisma.Route$stopsArgs<ExtArgs>;
    events?: boolean | Prisma.Route$eventsArgs<ExtArgs>;
    _count?: boolean | Prisma.RouteCountOutputTypeDefaultArgs<ExtArgs>;
};
export type RouteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    driver?: boolean | Prisma.Route$driverArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Route$vehicleArgs<ExtArgs>;
};
export type RouteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    driver?: boolean | Prisma.Route$driverArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Route$vehicleArgs<ExtArgs>;
};
export type $RoutePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Route";
    objects: {
        organization: Prisma.$OrganizationPayload<ExtArgs>;
        driver: Prisma.$DriverPayload<ExtArgs> | null;
        vehicle: Prisma.$VehiclePayload<ExtArgs> | null;
        activeDriver: Prisma.$DriverPayload<ExtArgs> | null;
        stops: Prisma.$RouteStopPayload<ExtArgs>[];
        events: Prisma.$RouteEventPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        organizationId: string;
        driverId: string | null;
        vehicleId: string | null;
        status: $Enums.RouteStatus;
        plannedDate: Date;
        totalDistanceMeters: number | null;
        totalDurationSeconds: number | null;
        capacityUsedKg: runtime.Decimal | null;
        startedAt: Date | null;
        finishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["route"]>;
    composites: {};
};
export type RouteGetPayload<S extends boolean | null | undefined | RouteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RoutePayload, S>;
export type RouteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RouteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RouteCountAggregateInputType | true;
};
export interface RouteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Route'];
        meta: {
            name: 'Route';
        };
    };
    findUnique<T extends RouteFindUniqueArgs>(args: Prisma.SelectSubset<T, RouteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RouteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RouteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RouteFindFirstArgs>(args?: Prisma.SelectSubset<T, RouteFindFirstArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RouteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RouteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RouteFindManyArgs>(args?: Prisma.SelectSubset<T, RouteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RouteCreateArgs>(args: Prisma.SelectSubset<T, RouteCreateArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RouteCreateManyArgs>(args?: Prisma.SelectSubset<T, RouteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RouteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RouteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RouteDeleteArgs>(args: Prisma.SelectSubset<T, RouteDeleteArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RouteUpdateArgs>(args: Prisma.SelectSubset<T, RouteUpdateArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RouteDeleteManyArgs>(args?: Prisma.SelectSubset<T, RouteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RouteUpdateManyArgs>(args: Prisma.SelectSubset<T, RouteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RouteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RouteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RouteUpsertArgs>(args: Prisma.SelectSubset<T, RouteUpsertArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RouteCountArgs>(args?: Prisma.Subset<T, RouteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RouteCountAggregateOutputType> : number>;
    aggregate<T extends RouteAggregateArgs>(args: Prisma.Subset<T, RouteAggregateArgs>): Prisma.PrismaPromise<GetRouteAggregateType<T>>;
    groupBy<T extends RouteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RouteGroupByArgs['orderBy'];
    } : {
        orderBy?: RouteGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RouteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRouteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RouteFieldRefs;
}
export interface Prisma__RouteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    organization<T extends Prisma.OrganizationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationDefaultArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    driver<T extends Prisma.Route$driverArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Route$driverArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    vehicle<T extends Prisma.Route$vehicleArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Route$vehicleArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    activeDriver<T extends Prisma.Route$activeDriverArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Route$activeDriverArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    stops<T extends Prisma.Route$stopsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Route$stopsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    events<T extends Prisma.Route$eventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Route$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RouteFieldRefs {
    readonly id: Prisma.FieldRef<"Route", 'String'>;
    readonly organizationId: Prisma.FieldRef<"Route", 'String'>;
    readonly driverId: Prisma.FieldRef<"Route", 'String'>;
    readonly vehicleId: Prisma.FieldRef<"Route", 'String'>;
    readonly status: Prisma.FieldRef<"Route", 'RouteStatus'>;
    readonly plannedDate: Prisma.FieldRef<"Route", 'DateTime'>;
    readonly totalDistanceMeters: Prisma.FieldRef<"Route", 'Int'>;
    readonly totalDurationSeconds: Prisma.FieldRef<"Route", 'Int'>;
    readonly capacityUsedKg: Prisma.FieldRef<"Route", 'Decimal'>;
    readonly startedAt: Prisma.FieldRef<"Route", 'DateTime'>;
    readonly finishedAt: Prisma.FieldRef<"Route", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Route", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Route", 'DateTime'>;
}
export type RouteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    where: Prisma.RouteWhereUniqueInput;
};
export type RouteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    where: Prisma.RouteWhereUniqueInput;
};
export type RouteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    where?: Prisma.RouteWhereInput;
    orderBy?: Prisma.RouteOrderByWithRelationInput | Prisma.RouteOrderByWithRelationInput[];
    cursor?: Prisma.RouteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RouteScalarFieldEnum | Prisma.RouteScalarFieldEnum[];
};
export type RouteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    where?: Prisma.RouteWhereInput;
    orderBy?: Prisma.RouteOrderByWithRelationInput | Prisma.RouteOrderByWithRelationInput[];
    cursor?: Prisma.RouteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RouteScalarFieldEnum | Prisma.RouteScalarFieldEnum[];
};
export type RouteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    where?: Prisma.RouteWhereInput;
    orderBy?: Prisma.RouteOrderByWithRelationInput | Prisma.RouteOrderByWithRelationInput[];
    cursor?: Prisma.RouteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RouteScalarFieldEnum | Prisma.RouteScalarFieldEnum[];
};
export type RouteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteCreateInput, Prisma.RouteUncheckedCreateInput>;
};
export type RouteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RouteCreateManyInput | Prisma.RouteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RouteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    data: Prisma.RouteCreateManyInput | Prisma.RouteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RouteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RouteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteUpdateInput, Prisma.RouteUncheckedUpdateInput>;
    where: Prisma.RouteWhereUniqueInput;
};
export type RouteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RouteUpdateManyMutationInput, Prisma.RouteUncheckedUpdateManyInput>;
    where?: Prisma.RouteWhereInput;
    limit?: number;
};
export type RouteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteUpdateManyMutationInput, Prisma.RouteUncheckedUpdateManyInput>;
    where?: Prisma.RouteWhereInput;
    limit?: number;
    include?: Prisma.RouteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RouteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    where: Prisma.RouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteCreateInput, Prisma.RouteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RouteUpdateInput, Prisma.RouteUncheckedUpdateInput>;
};
export type RouteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    where: Prisma.RouteWhereUniqueInput;
};
export type RouteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteWhereInput;
    limit?: number;
};
export type Route$driverArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    where?: Prisma.DriverWhereInput;
};
export type Route$vehicleArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    include?: Prisma.VehicleInclude<ExtArgs> | null;
    where?: Prisma.VehicleWhereInput;
};
export type Route$activeDriverArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    where?: Prisma.DriverWhereInput;
};
export type Route$stopsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelect<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    include?: Prisma.RouteStopInclude<ExtArgs> | null;
    where?: Prisma.RouteStopWhereInput;
    orderBy?: Prisma.RouteStopOrderByWithRelationInput | Prisma.RouteStopOrderByWithRelationInput[];
    cursor?: Prisma.RouteStopWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RouteStopScalarFieldEnum | Prisma.RouteStopScalarFieldEnum[];
};
export type Route$eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelect<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    include?: Prisma.RouteEventInclude<ExtArgs> | null;
    where?: Prisma.RouteEventWhereInput;
    orderBy?: Prisma.RouteEventOrderByWithRelationInput | Prisma.RouteEventOrderByWithRelationInput[];
    cursor?: Prisma.RouteEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RouteEventScalarFieldEnum | Prisma.RouteEventScalarFieldEnum[];
};
export type RouteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
};
