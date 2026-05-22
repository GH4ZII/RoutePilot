import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RouteStopModel = runtime.Types.Result.DefaultSelection<Prisma.$RouteStopPayload>;
export type AggregateRouteStop = {
    _count: RouteStopCountAggregateOutputType | null;
    _avg: RouteStopAvgAggregateOutputType | null;
    _sum: RouteStopSumAggregateOutputType | null;
    _min: RouteStopMinAggregateOutputType | null;
    _max: RouteStopMaxAggregateOutputType | null;
};
export type RouteStopAvgAggregateOutputType = {
    stopOrder: number | null;
};
export type RouteStopSumAggregateOutputType = {
    stopOrder: number | null;
};
export type RouteStopMinAggregateOutputType = {
    id: string | null;
    routeId: string | null;
    deliveryId: string | null;
    stopOrder: number | null;
    estimatedArrival: Date | null;
    actualArrival: Date | null;
    status: $Enums.RouteStopStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RouteStopMaxAggregateOutputType = {
    id: string | null;
    routeId: string | null;
    deliveryId: string | null;
    stopOrder: number | null;
    estimatedArrival: Date | null;
    actualArrival: Date | null;
    status: $Enums.RouteStopStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RouteStopCountAggregateOutputType = {
    id: number;
    routeId: number;
    deliveryId: number;
    stopOrder: number;
    estimatedArrival: number;
    actualArrival: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type RouteStopAvgAggregateInputType = {
    stopOrder?: true;
};
export type RouteStopSumAggregateInputType = {
    stopOrder?: true;
};
export type RouteStopMinAggregateInputType = {
    id?: true;
    routeId?: true;
    deliveryId?: true;
    stopOrder?: true;
    estimatedArrival?: true;
    actualArrival?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RouteStopMaxAggregateInputType = {
    id?: true;
    routeId?: true;
    deliveryId?: true;
    stopOrder?: true;
    estimatedArrival?: true;
    actualArrival?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RouteStopCountAggregateInputType = {
    id?: true;
    routeId?: true;
    deliveryId?: true;
    stopOrder?: true;
    estimatedArrival?: true;
    actualArrival?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type RouteStopAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteStopWhereInput;
    orderBy?: Prisma.RouteStopOrderByWithRelationInput | Prisma.RouteStopOrderByWithRelationInput[];
    cursor?: Prisma.RouteStopWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RouteStopCountAggregateInputType;
    _avg?: RouteStopAvgAggregateInputType;
    _sum?: RouteStopSumAggregateInputType;
    _min?: RouteStopMinAggregateInputType;
    _max?: RouteStopMaxAggregateInputType;
};
export type GetRouteStopAggregateType<T extends RouteStopAggregateArgs> = {
    [P in keyof T & keyof AggregateRouteStop]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRouteStop[P]> : Prisma.GetScalarType<T[P], AggregateRouteStop[P]>;
};
export type RouteStopGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteStopWhereInput;
    orderBy?: Prisma.RouteStopOrderByWithAggregationInput | Prisma.RouteStopOrderByWithAggregationInput[];
    by: Prisma.RouteStopScalarFieldEnum[] | Prisma.RouteStopScalarFieldEnum;
    having?: Prisma.RouteStopScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RouteStopCountAggregateInputType | true;
    _avg?: RouteStopAvgAggregateInputType;
    _sum?: RouteStopSumAggregateInputType;
    _min?: RouteStopMinAggregateInputType;
    _max?: RouteStopMaxAggregateInputType;
};
export type RouteStopGroupByOutputType = {
    id: string;
    routeId: string;
    deliveryId: string;
    stopOrder: number;
    estimatedArrival: Date | null;
    actualArrival: Date | null;
    status: $Enums.RouteStopStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: RouteStopCountAggregateOutputType | null;
    _avg: RouteStopAvgAggregateOutputType | null;
    _sum: RouteStopSumAggregateOutputType | null;
    _min: RouteStopMinAggregateOutputType | null;
    _max: RouteStopMaxAggregateOutputType | null;
};
export type GetRouteStopGroupByPayload<T extends RouteStopGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RouteStopGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RouteStopGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RouteStopGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RouteStopGroupByOutputType[P]>;
}>>;
export type RouteStopWhereInput = {
    AND?: Prisma.RouteStopWhereInput | Prisma.RouteStopWhereInput[];
    OR?: Prisma.RouteStopWhereInput[];
    NOT?: Prisma.RouteStopWhereInput | Prisma.RouteStopWhereInput[];
    id?: Prisma.StringFilter<"RouteStop"> | string;
    routeId?: Prisma.StringFilter<"RouteStop"> | string;
    deliveryId?: Prisma.StringFilter<"RouteStop"> | string;
    stopOrder?: Prisma.IntFilter<"RouteStop"> | number;
    estimatedArrival?: Prisma.DateTimeNullableFilter<"RouteStop"> | Date | string | null;
    actualArrival?: Prisma.DateTimeNullableFilter<"RouteStop"> | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFilter<"RouteStop"> | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFilter<"RouteStop"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RouteStop"> | Date | string;
    route?: Prisma.XOR<Prisma.RouteScalarRelationFilter, Prisma.RouteWhereInput>;
    delivery?: Prisma.XOR<Prisma.DeliveryScalarRelationFilter, Prisma.DeliveryWhereInput>;
    proofOfDelivery?: Prisma.XOR<Prisma.ProofOfDeliveryNullableScalarRelationFilter, Prisma.ProofOfDeliveryWhereInput> | null;
};
export type RouteStopOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    deliveryId?: Prisma.SortOrder;
    stopOrder?: Prisma.SortOrder;
    estimatedArrival?: Prisma.SortOrderInput | Prisma.SortOrder;
    actualArrival?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    route?: Prisma.RouteOrderByWithRelationInput;
    delivery?: Prisma.DeliveryOrderByWithRelationInput;
    proofOfDelivery?: Prisma.ProofOfDeliveryOrderByWithRelationInput;
};
export type RouteStopWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    routeId_deliveryId?: Prisma.RouteStopRouteIdDeliveryIdCompoundUniqueInput;
    routeId_stopOrder?: Prisma.RouteStopRouteIdStopOrderCompoundUniqueInput;
    AND?: Prisma.RouteStopWhereInput | Prisma.RouteStopWhereInput[];
    OR?: Prisma.RouteStopWhereInput[];
    NOT?: Prisma.RouteStopWhereInput | Prisma.RouteStopWhereInput[];
    routeId?: Prisma.StringFilter<"RouteStop"> | string;
    deliveryId?: Prisma.StringFilter<"RouteStop"> | string;
    stopOrder?: Prisma.IntFilter<"RouteStop"> | number;
    estimatedArrival?: Prisma.DateTimeNullableFilter<"RouteStop"> | Date | string | null;
    actualArrival?: Prisma.DateTimeNullableFilter<"RouteStop"> | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFilter<"RouteStop"> | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFilter<"RouteStop"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RouteStop"> | Date | string;
    route?: Prisma.XOR<Prisma.RouteScalarRelationFilter, Prisma.RouteWhereInput>;
    delivery?: Prisma.XOR<Prisma.DeliveryScalarRelationFilter, Prisma.DeliveryWhereInput>;
    proofOfDelivery?: Prisma.XOR<Prisma.ProofOfDeliveryNullableScalarRelationFilter, Prisma.ProofOfDeliveryWhereInput> | null;
}, "id" | "routeId_deliveryId" | "routeId_stopOrder">;
export type RouteStopOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    deliveryId?: Prisma.SortOrder;
    stopOrder?: Prisma.SortOrder;
    estimatedArrival?: Prisma.SortOrderInput | Prisma.SortOrder;
    actualArrival?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RouteStopCountOrderByAggregateInput;
    _avg?: Prisma.RouteStopAvgOrderByAggregateInput;
    _max?: Prisma.RouteStopMaxOrderByAggregateInput;
    _min?: Prisma.RouteStopMinOrderByAggregateInput;
    _sum?: Prisma.RouteStopSumOrderByAggregateInput;
};
export type RouteStopScalarWhereWithAggregatesInput = {
    AND?: Prisma.RouteStopScalarWhereWithAggregatesInput | Prisma.RouteStopScalarWhereWithAggregatesInput[];
    OR?: Prisma.RouteStopScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RouteStopScalarWhereWithAggregatesInput | Prisma.RouteStopScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RouteStop"> | string;
    routeId?: Prisma.StringWithAggregatesFilter<"RouteStop"> | string;
    deliveryId?: Prisma.StringWithAggregatesFilter<"RouteStop"> | string;
    stopOrder?: Prisma.IntWithAggregatesFilter<"RouteStop"> | number;
    estimatedArrival?: Prisma.DateTimeNullableWithAggregatesFilter<"RouteStop"> | Date | string | null;
    actualArrival?: Prisma.DateTimeNullableWithAggregatesFilter<"RouteStop"> | Date | string | null;
    status?: Prisma.EnumRouteStopStatusWithAggregatesFilter<"RouteStop"> | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RouteStop"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RouteStop"> | Date | string;
};
export type RouteStopCreateInput = {
    id?: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    route: Prisma.RouteCreateNestedOneWithoutStopsInput;
    delivery: Prisma.DeliveryCreateNestedOneWithoutRouteStopsInput;
    proofOfDelivery?: Prisma.ProofOfDeliveryCreateNestedOneWithoutRouteStopInput;
};
export type RouteStopUncheckedCreateInput = {
    id?: string;
    routeId: string;
    deliveryId: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    proofOfDelivery?: Prisma.ProofOfDeliveryUncheckedCreateNestedOneWithoutRouteStopInput;
};
export type RouteStopUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    route?: Prisma.RouteUpdateOneRequiredWithoutStopsNestedInput;
    delivery?: Prisma.DeliveryUpdateOneRequiredWithoutRouteStopsNestedInput;
    proofOfDelivery?: Prisma.ProofOfDeliveryUpdateOneWithoutRouteStopNestedInput;
};
export type RouteStopUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeId?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryId?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    proofOfDelivery?: Prisma.ProofOfDeliveryUncheckedUpdateOneWithoutRouteStopNestedInput;
};
export type RouteStopCreateManyInput = {
    id?: string;
    routeId: string;
    deliveryId: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RouteStopUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteStopUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeId?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryId?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteStopListRelationFilter = {
    every?: Prisma.RouteStopWhereInput;
    some?: Prisma.RouteStopWhereInput;
    none?: Prisma.RouteStopWhereInput;
};
export type RouteStopOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RouteStopRouteIdDeliveryIdCompoundUniqueInput = {
    routeId: string;
    deliveryId: string;
};
export type RouteStopRouteIdStopOrderCompoundUniqueInput = {
    routeId: string;
    stopOrder: number;
};
export type RouteStopCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    deliveryId?: Prisma.SortOrder;
    stopOrder?: Prisma.SortOrder;
    estimatedArrival?: Prisma.SortOrder;
    actualArrival?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RouteStopAvgOrderByAggregateInput = {
    stopOrder?: Prisma.SortOrder;
};
export type RouteStopMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    deliveryId?: Prisma.SortOrder;
    stopOrder?: Prisma.SortOrder;
    estimatedArrival?: Prisma.SortOrder;
    actualArrival?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RouteStopMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    deliveryId?: Prisma.SortOrder;
    stopOrder?: Prisma.SortOrder;
    estimatedArrival?: Prisma.SortOrder;
    actualArrival?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RouteStopSumOrderByAggregateInput = {
    stopOrder?: Prisma.SortOrder;
};
export type RouteStopScalarRelationFilter = {
    is?: Prisma.RouteStopWhereInput;
    isNot?: Prisma.RouteStopWhereInput;
};
export type RouteStopCreateNestedManyWithoutDeliveryInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutDeliveryInput> | Prisma.RouteStopCreateWithoutDeliveryInput[] | Prisma.RouteStopUncheckedCreateWithoutDeliveryInput[];
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutDeliveryInput | Prisma.RouteStopCreateOrConnectWithoutDeliveryInput[];
    createMany?: Prisma.RouteStopCreateManyDeliveryInputEnvelope;
    connect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
};
export type RouteStopUncheckedCreateNestedManyWithoutDeliveryInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutDeliveryInput> | Prisma.RouteStopCreateWithoutDeliveryInput[] | Prisma.RouteStopUncheckedCreateWithoutDeliveryInput[];
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutDeliveryInput | Prisma.RouteStopCreateOrConnectWithoutDeliveryInput[];
    createMany?: Prisma.RouteStopCreateManyDeliveryInputEnvelope;
    connect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
};
export type RouteStopUpdateManyWithoutDeliveryNestedInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutDeliveryInput> | Prisma.RouteStopCreateWithoutDeliveryInput[] | Prisma.RouteStopUncheckedCreateWithoutDeliveryInput[];
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutDeliveryInput | Prisma.RouteStopCreateOrConnectWithoutDeliveryInput[];
    upsert?: Prisma.RouteStopUpsertWithWhereUniqueWithoutDeliveryInput | Prisma.RouteStopUpsertWithWhereUniqueWithoutDeliveryInput[];
    createMany?: Prisma.RouteStopCreateManyDeliveryInputEnvelope;
    set?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    disconnect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    delete?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    connect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    update?: Prisma.RouteStopUpdateWithWhereUniqueWithoutDeliveryInput | Prisma.RouteStopUpdateWithWhereUniqueWithoutDeliveryInput[];
    updateMany?: Prisma.RouteStopUpdateManyWithWhereWithoutDeliveryInput | Prisma.RouteStopUpdateManyWithWhereWithoutDeliveryInput[];
    deleteMany?: Prisma.RouteStopScalarWhereInput | Prisma.RouteStopScalarWhereInput[];
};
export type RouteStopUncheckedUpdateManyWithoutDeliveryNestedInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutDeliveryInput> | Prisma.RouteStopCreateWithoutDeliveryInput[] | Prisma.RouteStopUncheckedCreateWithoutDeliveryInput[];
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutDeliveryInput | Prisma.RouteStopCreateOrConnectWithoutDeliveryInput[];
    upsert?: Prisma.RouteStopUpsertWithWhereUniqueWithoutDeliveryInput | Prisma.RouteStopUpsertWithWhereUniqueWithoutDeliveryInput[];
    createMany?: Prisma.RouteStopCreateManyDeliveryInputEnvelope;
    set?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    disconnect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    delete?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    connect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    update?: Prisma.RouteStopUpdateWithWhereUniqueWithoutDeliveryInput | Prisma.RouteStopUpdateWithWhereUniqueWithoutDeliveryInput[];
    updateMany?: Prisma.RouteStopUpdateManyWithWhereWithoutDeliveryInput | Prisma.RouteStopUpdateManyWithWhereWithoutDeliveryInput[];
    deleteMany?: Prisma.RouteStopScalarWhereInput | Prisma.RouteStopScalarWhereInput[];
};
export type RouteStopCreateNestedManyWithoutRouteInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutRouteInput, Prisma.RouteStopUncheckedCreateWithoutRouteInput> | Prisma.RouteStopCreateWithoutRouteInput[] | Prisma.RouteStopUncheckedCreateWithoutRouteInput[];
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutRouteInput | Prisma.RouteStopCreateOrConnectWithoutRouteInput[];
    createMany?: Prisma.RouteStopCreateManyRouteInputEnvelope;
    connect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
};
export type RouteStopUncheckedCreateNestedManyWithoutRouteInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutRouteInput, Prisma.RouteStopUncheckedCreateWithoutRouteInput> | Prisma.RouteStopCreateWithoutRouteInput[] | Prisma.RouteStopUncheckedCreateWithoutRouteInput[];
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutRouteInput | Prisma.RouteStopCreateOrConnectWithoutRouteInput[];
    createMany?: Prisma.RouteStopCreateManyRouteInputEnvelope;
    connect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
};
export type RouteStopUpdateManyWithoutRouteNestedInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutRouteInput, Prisma.RouteStopUncheckedCreateWithoutRouteInput> | Prisma.RouteStopCreateWithoutRouteInput[] | Prisma.RouteStopUncheckedCreateWithoutRouteInput[];
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutRouteInput | Prisma.RouteStopCreateOrConnectWithoutRouteInput[];
    upsert?: Prisma.RouteStopUpsertWithWhereUniqueWithoutRouteInput | Prisma.RouteStopUpsertWithWhereUniqueWithoutRouteInput[];
    createMany?: Prisma.RouteStopCreateManyRouteInputEnvelope;
    set?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    disconnect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    delete?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    connect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    update?: Prisma.RouteStopUpdateWithWhereUniqueWithoutRouteInput | Prisma.RouteStopUpdateWithWhereUniqueWithoutRouteInput[];
    updateMany?: Prisma.RouteStopUpdateManyWithWhereWithoutRouteInput | Prisma.RouteStopUpdateManyWithWhereWithoutRouteInput[];
    deleteMany?: Prisma.RouteStopScalarWhereInput | Prisma.RouteStopScalarWhereInput[];
};
export type RouteStopUncheckedUpdateManyWithoutRouteNestedInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutRouteInput, Prisma.RouteStopUncheckedCreateWithoutRouteInput> | Prisma.RouteStopCreateWithoutRouteInput[] | Prisma.RouteStopUncheckedCreateWithoutRouteInput[];
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutRouteInput | Prisma.RouteStopCreateOrConnectWithoutRouteInput[];
    upsert?: Prisma.RouteStopUpsertWithWhereUniqueWithoutRouteInput | Prisma.RouteStopUpsertWithWhereUniqueWithoutRouteInput[];
    createMany?: Prisma.RouteStopCreateManyRouteInputEnvelope;
    set?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    disconnect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    delete?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    connect?: Prisma.RouteStopWhereUniqueInput | Prisma.RouteStopWhereUniqueInput[];
    update?: Prisma.RouteStopUpdateWithWhereUniqueWithoutRouteInput | Prisma.RouteStopUpdateWithWhereUniqueWithoutRouteInput[];
    updateMany?: Prisma.RouteStopUpdateManyWithWhereWithoutRouteInput | Prisma.RouteStopUpdateManyWithWhereWithoutRouteInput[];
    deleteMany?: Prisma.RouteStopScalarWhereInput | Prisma.RouteStopScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumRouteStopStatusFieldUpdateOperationsInput = {
    set?: $Enums.RouteStopStatus;
};
export type RouteStopCreateNestedOneWithoutProofOfDeliveryInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutProofOfDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutProofOfDeliveryInput>;
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutProofOfDeliveryInput;
    connect?: Prisma.RouteStopWhereUniqueInput;
};
export type RouteStopUpdateOneRequiredWithoutProofOfDeliveryNestedInput = {
    create?: Prisma.XOR<Prisma.RouteStopCreateWithoutProofOfDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutProofOfDeliveryInput>;
    connectOrCreate?: Prisma.RouteStopCreateOrConnectWithoutProofOfDeliveryInput;
    upsert?: Prisma.RouteStopUpsertWithoutProofOfDeliveryInput;
    connect?: Prisma.RouteStopWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RouteStopUpdateToOneWithWhereWithoutProofOfDeliveryInput, Prisma.RouteStopUpdateWithoutProofOfDeliveryInput>, Prisma.RouteStopUncheckedUpdateWithoutProofOfDeliveryInput>;
};
export type RouteStopCreateWithoutDeliveryInput = {
    id?: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    route: Prisma.RouteCreateNestedOneWithoutStopsInput;
    proofOfDelivery?: Prisma.ProofOfDeliveryCreateNestedOneWithoutRouteStopInput;
};
export type RouteStopUncheckedCreateWithoutDeliveryInput = {
    id?: string;
    routeId: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    proofOfDelivery?: Prisma.ProofOfDeliveryUncheckedCreateNestedOneWithoutRouteStopInput;
};
export type RouteStopCreateOrConnectWithoutDeliveryInput = {
    where: Prisma.RouteStopWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteStopCreateWithoutDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutDeliveryInput>;
};
export type RouteStopCreateManyDeliveryInputEnvelope = {
    data: Prisma.RouteStopCreateManyDeliveryInput | Prisma.RouteStopCreateManyDeliveryInput[];
    skipDuplicates?: boolean;
};
export type RouteStopUpsertWithWhereUniqueWithoutDeliveryInput = {
    where: Prisma.RouteStopWhereUniqueInput;
    update: Prisma.XOR<Prisma.RouteStopUpdateWithoutDeliveryInput, Prisma.RouteStopUncheckedUpdateWithoutDeliveryInput>;
    create: Prisma.XOR<Prisma.RouteStopCreateWithoutDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutDeliveryInput>;
};
export type RouteStopUpdateWithWhereUniqueWithoutDeliveryInput = {
    where: Prisma.RouteStopWhereUniqueInput;
    data: Prisma.XOR<Prisma.RouteStopUpdateWithoutDeliveryInput, Prisma.RouteStopUncheckedUpdateWithoutDeliveryInput>;
};
export type RouteStopUpdateManyWithWhereWithoutDeliveryInput = {
    where: Prisma.RouteStopScalarWhereInput;
    data: Prisma.XOR<Prisma.RouteStopUpdateManyMutationInput, Prisma.RouteStopUncheckedUpdateManyWithoutDeliveryInput>;
};
export type RouteStopScalarWhereInput = {
    AND?: Prisma.RouteStopScalarWhereInput | Prisma.RouteStopScalarWhereInput[];
    OR?: Prisma.RouteStopScalarWhereInput[];
    NOT?: Prisma.RouteStopScalarWhereInput | Prisma.RouteStopScalarWhereInput[];
    id?: Prisma.StringFilter<"RouteStop"> | string;
    routeId?: Prisma.StringFilter<"RouteStop"> | string;
    deliveryId?: Prisma.StringFilter<"RouteStop"> | string;
    stopOrder?: Prisma.IntFilter<"RouteStop"> | number;
    estimatedArrival?: Prisma.DateTimeNullableFilter<"RouteStop"> | Date | string | null;
    actualArrival?: Prisma.DateTimeNullableFilter<"RouteStop"> | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFilter<"RouteStop"> | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFilter<"RouteStop"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RouteStop"> | Date | string;
};
export type RouteStopCreateWithoutRouteInput = {
    id?: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    delivery: Prisma.DeliveryCreateNestedOneWithoutRouteStopsInput;
    proofOfDelivery?: Prisma.ProofOfDeliveryCreateNestedOneWithoutRouteStopInput;
};
export type RouteStopUncheckedCreateWithoutRouteInput = {
    id?: string;
    deliveryId: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    proofOfDelivery?: Prisma.ProofOfDeliveryUncheckedCreateNestedOneWithoutRouteStopInput;
};
export type RouteStopCreateOrConnectWithoutRouteInput = {
    where: Prisma.RouteStopWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteStopCreateWithoutRouteInput, Prisma.RouteStopUncheckedCreateWithoutRouteInput>;
};
export type RouteStopCreateManyRouteInputEnvelope = {
    data: Prisma.RouteStopCreateManyRouteInput | Prisma.RouteStopCreateManyRouteInput[];
    skipDuplicates?: boolean;
};
export type RouteStopUpsertWithWhereUniqueWithoutRouteInput = {
    where: Prisma.RouteStopWhereUniqueInput;
    update: Prisma.XOR<Prisma.RouteStopUpdateWithoutRouteInput, Prisma.RouteStopUncheckedUpdateWithoutRouteInput>;
    create: Prisma.XOR<Prisma.RouteStopCreateWithoutRouteInput, Prisma.RouteStopUncheckedCreateWithoutRouteInput>;
};
export type RouteStopUpdateWithWhereUniqueWithoutRouteInput = {
    where: Prisma.RouteStopWhereUniqueInput;
    data: Prisma.XOR<Prisma.RouteStopUpdateWithoutRouteInput, Prisma.RouteStopUncheckedUpdateWithoutRouteInput>;
};
export type RouteStopUpdateManyWithWhereWithoutRouteInput = {
    where: Prisma.RouteStopScalarWhereInput;
    data: Prisma.XOR<Prisma.RouteStopUpdateManyMutationInput, Prisma.RouteStopUncheckedUpdateManyWithoutRouteInput>;
};
export type RouteStopCreateWithoutProofOfDeliveryInput = {
    id?: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    route: Prisma.RouteCreateNestedOneWithoutStopsInput;
    delivery: Prisma.DeliveryCreateNestedOneWithoutRouteStopsInput;
};
export type RouteStopUncheckedCreateWithoutProofOfDeliveryInput = {
    id?: string;
    routeId: string;
    deliveryId: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RouteStopCreateOrConnectWithoutProofOfDeliveryInput = {
    where: Prisma.RouteStopWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteStopCreateWithoutProofOfDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutProofOfDeliveryInput>;
};
export type RouteStopUpsertWithoutProofOfDeliveryInput = {
    update: Prisma.XOR<Prisma.RouteStopUpdateWithoutProofOfDeliveryInput, Prisma.RouteStopUncheckedUpdateWithoutProofOfDeliveryInput>;
    create: Prisma.XOR<Prisma.RouteStopCreateWithoutProofOfDeliveryInput, Prisma.RouteStopUncheckedCreateWithoutProofOfDeliveryInput>;
    where?: Prisma.RouteStopWhereInput;
};
export type RouteStopUpdateToOneWithWhereWithoutProofOfDeliveryInput = {
    where?: Prisma.RouteStopWhereInput;
    data: Prisma.XOR<Prisma.RouteStopUpdateWithoutProofOfDeliveryInput, Prisma.RouteStopUncheckedUpdateWithoutProofOfDeliveryInput>;
};
export type RouteStopUpdateWithoutProofOfDeliveryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    route?: Prisma.RouteUpdateOneRequiredWithoutStopsNestedInput;
    delivery?: Prisma.DeliveryUpdateOneRequiredWithoutRouteStopsNestedInput;
};
export type RouteStopUncheckedUpdateWithoutProofOfDeliveryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeId?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryId?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteStopCreateManyDeliveryInput = {
    id?: string;
    routeId: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RouteStopUpdateWithoutDeliveryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    route?: Prisma.RouteUpdateOneRequiredWithoutStopsNestedInput;
    proofOfDelivery?: Prisma.ProofOfDeliveryUpdateOneWithoutRouteStopNestedInput;
};
export type RouteStopUncheckedUpdateWithoutDeliveryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeId?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    proofOfDelivery?: Prisma.ProofOfDeliveryUncheckedUpdateOneWithoutRouteStopNestedInput;
};
export type RouteStopUncheckedUpdateManyWithoutDeliveryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeId?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteStopCreateManyRouteInput = {
    id?: string;
    deliveryId: string;
    stopOrder: number;
    estimatedArrival?: Date | string | null;
    actualArrival?: Date | string | null;
    status?: $Enums.RouteStopStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RouteStopUpdateWithoutRouteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery?: Prisma.DeliveryUpdateOneRequiredWithoutRouteStopsNestedInput;
    proofOfDelivery?: Prisma.ProofOfDeliveryUpdateOneWithoutRouteStopNestedInput;
};
export type RouteStopUncheckedUpdateWithoutRouteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryId?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    proofOfDelivery?: Prisma.ProofOfDeliveryUncheckedUpdateOneWithoutRouteStopNestedInput;
};
export type RouteStopUncheckedUpdateManyWithoutRouteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryId?: Prisma.StringFieldUpdateOperationsInput | string;
    stopOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    estimatedArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualArrival?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumRouteStopStatusFieldUpdateOperationsInput | $Enums.RouteStopStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteStopSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeId?: boolean;
    deliveryId?: boolean;
    stopOrder?: boolean;
    estimatedArrival?: boolean;
    actualArrival?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
    delivery?: boolean | Prisma.DeliveryDefaultArgs<ExtArgs>;
    proofOfDelivery?: boolean | Prisma.RouteStop$proofOfDeliveryArgs<ExtArgs>;
}, ExtArgs["result"]["routeStop"]>;
export type RouteStopSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeId?: boolean;
    deliveryId?: boolean;
    stopOrder?: boolean;
    estimatedArrival?: boolean;
    actualArrival?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
    delivery?: boolean | Prisma.DeliveryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["routeStop"]>;
export type RouteStopSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeId?: boolean;
    deliveryId?: boolean;
    stopOrder?: boolean;
    estimatedArrival?: boolean;
    actualArrival?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
    delivery?: boolean | Prisma.DeliveryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["routeStop"]>;
export type RouteStopSelectScalar = {
    id?: boolean;
    routeId?: boolean;
    deliveryId?: boolean;
    stopOrder?: boolean;
    estimatedArrival?: boolean;
    actualArrival?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type RouteStopOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "routeId" | "deliveryId" | "stopOrder" | "estimatedArrival" | "actualArrival" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["routeStop"]>;
export type RouteStopInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
    delivery?: boolean | Prisma.DeliveryDefaultArgs<ExtArgs>;
    proofOfDelivery?: boolean | Prisma.RouteStop$proofOfDeliveryArgs<ExtArgs>;
};
export type RouteStopIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
    delivery?: boolean | Prisma.DeliveryDefaultArgs<ExtArgs>;
};
export type RouteStopIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
    delivery?: boolean | Prisma.DeliveryDefaultArgs<ExtArgs>;
};
export type $RouteStopPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RouteStop";
    objects: {
        route: Prisma.$RoutePayload<ExtArgs>;
        delivery: Prisma.$DeliveryPayload<ExtArgs>;
        proofOfDelivery: Prisma.$ProofOfDeliveryPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        routeId: string;
        deliveryId: string;
        stopOrder: number;
        estimatedArrival: Date | null;
        actualArrival: Date | null;
        status: $Enums.RouteStopStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["routeStop"]>;
    composites: {};
};
export type RouteStopGetPayload<S extends boolean | null | undefined | RouteStopDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RouteStopPayload, S>;
export type RouteStopCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RouteStopFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RouteStopCountAggregateInputType | true;
};
export interface RouteStopDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RouteStop'];
        meta: {
            name: 'RouteStop';
        };
    };
    findUnique<T extends RouteStopFindUniqueArgs>(args: Prisma.SelectSubset<T, RouteStopFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RouteStopFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RouteStopFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RouteStopFindFirstArgs>(args?: Prisma.SelectSubset<T, RouteStopFindFirstArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RouteStopFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RouteStopFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RouteStopFindManyArgs>(args?: Prisma.SelectSubset<T, RouteStopFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RouteStopCreateArgs>(args: Prisma.SelectSubset<T, RouteStopCreateArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RouteStopCreateManyArgs>(args?: Prisma.SelectSubset<T, RouteStopCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RouteStopCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RouteStopCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RouteStopDeleteArgs>(args: Prisma.SelectSubset<T, RouteStopDeleteArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RouteStopUpdateArgs>(args: Prisma.SelectSubset<T, RouteStopUpdateArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RouteStopDeleteManyArgs>(args?: Prisma.SelectSubset<T, RouteStopDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RouteStopUpdateManyArgs>(args: Prisma.SelectSubset<T, RouteStopUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RouteStopUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RouteStopUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RouteStopUpsertArgs>(args: Prisma.SelectSubset<T, RouteStopUpsertArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RouteStopCountArgs>(args?: Prisma.Subset<T, RouteStopCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RouteStopCountAggregateOutputType> : number>;
    aggregate<T extends RouteStopAggregateArgs>(args: Prisma.Subset<T, RouteStopAggregateArgs>): Prisma.PrismaPromise<GetRouteStopAggregateType<T>>;
    groupBy<T extends RouteStopGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RouteStopGroupByArgs['orderBy'];
    } : {
        orderBy?: RouteStopGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RouteStopGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRouteStopGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RouteStopFieldRefs;
}
export interface Prisma__RouteStopClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    route<T extends Prisma.RouteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RouteDefaultArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    delivery<T extends Prisma.DeliveryDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DeliveryDefaultArgs<ExtArgs>>): Prisma.Prisma__DeliveryClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    proofOfDelivery<T extends Prisma.RouteStop$proofOfDeliveryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RouteStop$proofOfDeliveryArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RouteStopFieldRefs {
    readonly id: Prisma.FieldRef<"RouteStop", 'String'>;
    readonly routeId: Prisma.FieldRef<"RouteStop", 'String'>;
    readonly deliveryId: Prisma.FieldRef<"RouteStop", 'String'>;
    readonly stopOrder: Prisma.FieldRef<"RouteStop", 'Int'>;
    readonly estimatedArrival: Prisma.FieldRef<"RouteStop", 'DateTime'>;
    readonly actualArrival: Prisma.FieldRef<"RouteStop", 'DateTime'>;
    readonly status: Prisma.FieldRef<"RouteStop", 'RouteStopStatus'>;
    readonly createdAt: Prisma.FieldRef<"RouteStop", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"RouteStop", 'DateTime'>;
}
export type RouteStopFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelect<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    include?: Prisma.RouteStopInclude<ExtArgs> | null;
    where: Prisma.RouteStopWhereUniqueInput;
};
export type RouteStopFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelect<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    include?: Prisma.RouteStopInclude<ExtArgs> | null;
    where: Prisma.RouteStopWhereUniqueInput;
};
export type RouteStopFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RouteStopFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RouteStopFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RouteStopCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelect<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    include?: Prisma.RouteStopInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteStopCreateInput, Prisma.RouteStopUncheckedCreateInput>;
};
export type RouteStopCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RouteStopCreateManyInput | Prisma.RouteStopCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RouteStopCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    data: Prisma.RouteStopCreateManyInput | Prisma.RouteStopCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RouteStopIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RouteStopUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelect<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    include?: Prisma.RouteStopInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteStopUpdateInput, Prisma.RouteStopUncheckedUpdateInput>;
    where: Prisma.RouteStopWhereUniqueInput;
};
export type RouteStopUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RouteStopUpdateManyMutationInput, Prisma.RouteStopUncheckedUpdateManyInput>;
    where?: Prisma.RouteStopWhereInput;
    limit?: number;
};
export type RouteStopUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteStopUpdateManyMutationInput, Prisma.RouteStopUncheckedUpdateManyInput>;
    where?: Prisma.RouteStopWhereInput;
    limit?: number;
    include?: Prisma.RouteStopIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RouteStopUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelect<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    include?: Prisma.RouteStopInclude<ExtArgs> | null;
    where: Prisma.RouteStopWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteStopCreateInput, Prisma.RouteStopUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RouteStopUpdateInput, Prisma.RouteStopUncheckedUpdateInput>;
};
export type RouteStopDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelect<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    include?: Prisma.RouteStopInclude<ExtArgs> | null;
    where: Prisma.RouteStopWhereUniqueInput;
};
export type RouteStopDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteStopWhereInput;
    limit?: number;
};
export type RouteStop$proofOfDeliveryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    where?: Prisma.ProofOfDeliveryWhereInput;
};
export type RouteStopDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteStopSelect<ExtArgs> | null;
    omit?: Prisma.RouteStopOmit<ExtArgs> | null;
    include?: Prisma.RouteStopInclude<ExtArgs> | null;
};
