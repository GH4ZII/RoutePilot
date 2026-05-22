import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProofOfDeliveryModel = runtime.Types.Result.DefaultSelection<Prisma.$ProofOfDeliveryPayload>;
export type AggregateProofOfDelivery = {
    _count: ProofOfDeliveryCountAggregateOutputType | null;
    _avg: ProofOfDeliveryAvgAggregateOutputType | null;
    _sum: ProofOfDeliverySumAggregateOutputType | null;
    _min: ProofOfDeliveryMinAggregateOutputType | null;
    _max: ProofOfDeliveryMaxAggregateOutputType | null;
};
export type ProofOfDeliveryAvgAggregateOutputType = {
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
};
export type ProofOfDeliverySumAggregateOutputType = {
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
};
export type ProofOfDeliveryMinAggregateOutputType = {
    id: string | null;
    routeStopId: string | null;
    photoUrl: string | null;
    signatureUrl: string | null;
    note: string | null;
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
    capturedAt: Date | null;
    createdAt: Date | null;
};
export type ProofOfDeliveryMaxAggregateOutputType = {
    id: string | null;
    routeStopId: string | null;
    photoUrl: string | null;
    signatureUrl: string | null;
    note: string | null;
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
    capturedAt: Date | null;
    createdAt: Date | null;
};
export type ProofOfDeliveryCountAggregateOutputType = {
    id: number;
    routeStopId: number;
    photoUrl: number;
    signatureUrl: number;
    note: number;
    latitude: number;
    longitude: number;
    capturedAt: number;
    createdAt: number;
    _all: number;
};
export type ProofOfDeliveryAvgAggregateInputType = {
    latitude?: true;
    longitude?: true;
};
export type ProofOfDeliverySumAggregateInputType = {
    latitude?: true;
    longitude?: true;
};
export type ProofOfDeliveryMinAggregateInputType = {
    id?: true;
    routeStopId?: true;
    photoUrl?: true;
    signatureUrl?: true;
    note?: true;
    latitude?: true;
    longitude?: true;
    capturedAt?: true;
    createdAt?: true;
};
export type ProofOfDeliveryMaxAggregateInputType = {
    id?: true;
    routeStopId?: true;
    photoUrl?: true;
    signatureUrl?: true;
    note?: true;
    latitude?: true;
    longitude?: true;
    capturedAt?: true;
    createdAt?: true;
};
export type ProofOfDeliveryCountAggregateInputType = {
    id?: true;
    routeStopId?: true;
    photoUrl?: true;
    signatureUrl?: true;
    note?: true;
    latitude?: true;
    longitude?: true;
    capturedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type ProofOfDeliveryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProofOfDeliveryWhereInput;
    orderBy?: Prisma.ProofOfDeliveryOrderByWithRelationInput | Prisma.ProofOfDeliveryOrderByWithRelationInput[];
    cursor?: Prisma.ProofOfDeliveryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProofOfDeliveryCountAggregateInputType;
    _avg?: ProofOfDeliveryAvgAggregateInputType;
    _sum?: ProofOfDeliverySumAggregateInputType;
    _min?: ProofOfDeliveryMinAggregateInputType;
    _max?: ProofOfDeliveryMaxAggregateInputType;
};
export type GetProofOfDeliveryAggregateType<T extends ProofOfDeliveryAggregateArgs> = {
    [P in keyof T & keyof AggregateProofOfDelivery]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProofOfDelivery[P]> : Prisma.GetScalarType<T[P], AggregateProofOfDelivery[P]>;
};
export type ProofOfDeliveryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProofOfDeliveryWhereInput;
    orderBy?: Prisma.ProofOfDeliveryOrderByWithAggregationInput | Prisma.ProofOfDeliveryOrderByWithAggregationInput[];
    by: Prisma.ProofOfDeliveryScalarFieldEnum[] | Prisma.ProofOfDeliveryScalarFieldEnum;
    having?: Prisma.ProofOfDeliveryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProofOfDeliveryCountAggregateInputType | true;
    _avg?: ProofOfDeliveryAvgAggregateInputType;
    _sum?: ProofOfDeliverySumAggregateInputType;
    _min?: ProofOfDeliveryMinAggregateInputType;
    _max?: ProofOfDeliveryMaxAggregateInputType;
};
export type ProofOfDeliveryGroupByOutputType = {
    id: string;
    routeStopId: string;
    photoUrl: string | null;
    signatureUrl: string | null;
    note: string | null;
    latitude: runtime.Decimal | null;
    longitude: runtime.Decimal | null;
    capturedAt: Date;
    createdAt: Date;
    _count: ProofOfDeliveryCountAggregateOutputType | null;
    _avg: ProofOfDeliveryAvgAggregateOutputType | null;
    _sum: ProofOfDeliverySumAggregateOutputType | null;
    _min: ProofOfDeliveryMinAggregateOutputType | null;
    _max: ProofOfDeliveryMaxAggregateOutputType | null;
};
export type GetProofOfDeliveryGroupByPayload<T extends ProofOfDeliveryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProofOfDeliveryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProofOfDeliveryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProofOfDeliveryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProofOfDeliveryGroupByOutputType[P]>;
}>>;
export type ProofOfDeliveryWhereInput = {
    AND?: Prisma.ProofOfDeliveryWhereInput | Prisma.ProofOfDeliveryWhereInput[];
    OR?: Prisma.ProofOfDeliveryWhereInput[];
    NOT?: Prisma.ProofOfDeliveryWhereInput | Prisma.ProofOfDeliveryWhereInput[];
    id?: Prisma.StringFilter<"ProofOfDelivery"> | string;
    routeStopId?: Prisma.StringFilter<"ProofOfDelivery"> | string;
    photoUrl?: Prisma.StringNullableFilter<"ProofOfDelivery"> | string | null;
    signatureUrl?: Prisma.StringNullableFilter<"ProofOfDelivery"> | string | null;
    note?: Prisma.StringNullableFilter<"ProofOfDelivery"> | string | null;
    latitude?: Prisma.DecimalNullableFilter<"ProofOfDelivery"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.DecimalNullableFilter<"ProofOfDelivery"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeFilter<"ProofOfDelivery"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ProofOfDelivery"> | Date | string;
    routeStop?: Prisma.XOR<Prisma.RouteStopScalarRelationFilter, Prisma.RouteStopWhereInput>;
};
export type ProofOfDeliveryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    routeStopId?: Prisma.SortOrder;
    photoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    signatureUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    latitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    longitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    routeStop?: Prisma.RouteStopOrderByWithRelationInput;
};
export type ProofOfDeliveryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    routeStopId?: string;
    AND?: Prisma.ProofOfDeliveryWhereInput | Prisma.ProofOfDeliveryWhereInput[];
    OR?: Prisma.ProofOfDeliveryWhereInput[];
    NOT?: Prisma.ProofOfDeliveryWhereInput | Prisma.ProofOfDeliveryWhereInput[];
    photoUrl?: Prisma.StringNullableFilter<"ProofOfDelivery"> | string | null;
    signatureUrl?: Prisma.StringNullableFilter<"ProofOfDelivery"> | string | null;
    note?: Prisma.StringNullableFilter<"ProofOfDelivery"> | string | null;
    latitude?: Prisma.DecimalNullableFilter<"ProofOfDelivery"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.DecimalNullableFilter<"ProofOfDelivery"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeFilter<"ProofOfDelivery"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ProofOfDelivery"> | Date | string;
    routeStop?: Prisma.XOR<Prisma.RouteStopScalarRelationFilter, Prisma.RouteStopWhereInput>;
}, "id" | "routeStopId">;
export type ProofOfDeliveryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    routeStopId?: Prisma.SortOrder;
    photoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    signatureUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    latitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    longitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProofOfDeliveryCountOrderByAggregateInput;
    _avg?: Prisma.ProofOfDeliveryAvgOrderByAggregateInput;
    _max?: Prisma.ProofOfDeliveryMaxOrderByAggregateInput;
    _min?: Prisma.ProofOfDeliveryMinOrderByAggregateInput;
    _sum?: Prisma.ProofOfDeliverySumOrderByAggregateInput;
};
export type ProofOfDeliveryScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProofOfDeliveryScalarWhereWithAggregatesInput | Prisma.ProofOfDeliveryScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProofOfDeliveryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProofOfDeliveryScalarWhereWithAggregatesInput | Prisma.ProofOfDeliveryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProofOfDelivery"> | string;
    routeStopId?: Prisma.StringWithAggregatesFilter<"ProofOfDelivery"> | string;
    photoUrl?: Prisma.StringNullableWithAggregatesFilter<"ProofOfDelivery"> | string | null;
    signatureUrl?: Prisma.StringNullableWithAggregatesFilter<"ProofOfDelivery"> | string | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"ProofOfDelivery"> | string | null;
    latitude?: Prisma.DecimalNullableWithAggregatesFilter<"ProofOfDelivery"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.DecimalNullableWithAggregatesFilter<"ProofOfDelivery"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeWithAggregatesFilter<"ProofOfDelivery"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProofOfDelivery"> | Date | string;
};
export type ProofOfDeliveryCreateInput = {
    id?: string;
    photoUrl?: string | null;
    signatureUrl?: string | null;
    note?: string | null;
    latitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Date | string;
    createdAt?: Date | string;
    routeStop: Prisma.RouteStopCreateNestedOneWithoutProofOfDeliveryInput;
};
export type ProofOfDeliveryUncheckedCreateInput = {
    id?: string;
    routeStopId: string;
    photoUrl?: string | null;
    signatureUrl?: string | null;
    note?: string | null;
    latitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Date | string;
    createdAt?: Date | string;
};
export type ProofOfDeliveryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    photoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signatureUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    routeStop?: Prisma.RouteStopUpdateOneRequiredWithoutProofOfDeliveryNestedInput;
};
export type ProofOfDeliveryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeStopId?: Prisma.StringFieldUpdateOperationsInput | string;
    photoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signatureUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProofOfDeliveryCreateManyInput = {
    id?: string;
    routeStopId: string;
    photoUrl?: string | null;
    signatureUrl?: string | null;
    note?: string | null;
    latitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Date | string;
    createdAt?: Date | string;
};
export type ProofOfDeliveryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    photoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signatureUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProofOfDeliveryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeStopId?: Prisma.StringFieldUpdateOperationsInput | string;
    photoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signatureUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProofOfDeliveryNullableScalarRelationFilter = {
    is?: Prisma.ProofOfDeliveryWhereInput | null;
    isNot?: Prisma.ProofOfDeliveryWhereInput | null;
};
export type ProofOfDeliveryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeStopId?: Prisma.SortOrder;
    photoUrl?: Prisma.SortOrder;
    signatureUrl?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProofOfDeliveryAvgOrderByAggregateInput = {
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
};
export type ProofOfDeliveryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeStopId?: Prisma.SortOrder;
    photoUrl?: Prisma.SortOrder;
    signatureUrl?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProofOfDeliveryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeStopId?: Prisma.SortOrder;
    photoUrl?: Prisma.SortOrder;
    signatureUrl?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProofOfDeliverySumOrderByAggregateInput = {
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
};
export type ProofOfDeliveryCreateNestedOneWithoutRouteStopInput = {
    create?: Prisma.XOR<Prisma.ProofOfDeliveryCreateWithoutRouteStopInput, Prisma.ProofOfDeliveryUncheckedCreateWithoutRouteStopInput>;
    connectOrCreate?: Prisma.ProofOfDeliveryCreateOrConnectWithoutRouteStopInput;
    connect?: Prisma.ProofOfDeliveryWhereUniqueInput;
};
export type ProofOfDeliveryUncheckedCreateNestedOneWithoutRouteStopInput = {
    create?: Prisma.XOR<Prisma.ProofOfDeliveryCreateWithoutRouteStopInput, Prisma.ProofOfDeliveryUncheckedCreateWithoutRouteStopInput>;
    connectOrCreate?: Prisma.ProofOfDeliveryCreateOrConnectWithoutRouteStopInput;
    connect?: Prisma.ProofOfDeliveryWhereUniqueInput;
};
export type ProofOfDeliveryUpdateOneWithoutRouteStopNestedInput = {
    create?: Prisma.XOR<Prisma.ProofOfDeliveryCreateWithoutRouteStopInput, Prisma.ProofOfDeliveryUncheckedCreateWithoutRouteStopInput>;
    connectOrCreate?: Prisma.ProofOfDeliveryCreateOrConnectWithoutRouteStopInput;
    upsert?: Prisma.ProofOfDeliveryUpsertWithoutRouteStopInput;
    disconnect?: Prisma.ProofOfDeliveryWhereInput | boolean;
    delete?: Prisma.ProofOfDeliveryWhereInput | boolean;
    connect?: Prisma.ProofOfDeliveryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProofOfDeliveryUpdateToOneWithWhereWithoutRouteStopInput, Prisma.ProofOfDeliveryUpdateWithoutRouteStopInput>, Prisma.ProofOfDeliveryUncheckedUpdateWithoutRouteStopInput>;
};
export type ProofOfDeliveryUncheckedUpdateOneWithoutRouteStopNestedInput = {
    create?: Prisma.XOR<Prisma.ProofOfDeliveryCreateWithoutRouteStopInput, Prisma.ProofOfDeliveryUncheckedCreateWithoutRouteStopInput>;
    connectOrCreate?: Prisma.ProofOfDeliveryCreateOrConnectWithoutRouteStopInput;
    upsert?: Prisma.ProofOfDeliveryUpsertWithoutRouteStopInput;
    disconnect?: Prisma.ProofOfDeliveryWhereInput | boolean;
    delete?: Prisma.ProofOfDeliveryWhereInput | boolean;
    connect?: Prisma.ProofOfDeliveryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProofOfDeliveryUpdateToOneWithWhereWithoutRouteStopInput, Prisma.ProofOfDeliveryUpdateWithoutRouteStopInput>, Prisma.ProofOfDeliveryUncheckedUpdateWithoutRouteStopInput>;
};
export type ProofOfDeliveryCreateWithoutRouteStopInput = {
    id?: string;
    photoUrl?: string | null;
    signatureUrl?: string | null;
    note?: string | null;
    latitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Date | string;
    createdAt?: Date | string;
};
export type ProofOfDeliveryUncheckedCreateWithoutRouteStopInput = {
    id?: string;
    photoUrl?: string | null;
    signatureUrl?: string | null;
    note?: string | null;
    latitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Date | string;
    createdAt?: Date | string;
};
export type ProofOfDeliveryCreateOrConnectWithoutRouteStopInput = {
    where: Prisma.ProofOfDeliveryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProofOfDeliveryCreateWithoutRouteStopInput, Prisma.ProofOfDeliveryUncheckedCreateWithoutRouteStopInput>;
};
export type ProofOfDeliveryUpsertWithoutRouteStopInput = {
    update: Prisma.XOR<Prisma.ProofOfDeliveryUpdateWithoutRouteStopInput, Prisma.ProofOfDeliveryUncheckedUpdateWithoutRouteStopInput>;
    create: Prisma.XOR<Prisma.ProofOfDeliveryCreateWithoutRouteStopInput, Prisma.ProofOfDeliveryUncheckedCreateWithoutRouteStopInput>;
    where?: Prisma.ProofOfDeliveryWhereInput;
};
export type ProofOfDeliveryUpdateToOneWithWhereWithoutRouteStopInput = {
    where?: Prisma.ProofOfDeliveryWhereInput;
    data: Prisma.XOR<Prisma.ProofOfDeliveryUpdateWithoutRouteStopInput, Prisma.ProofOfDeliveryUncheckedUpdateWithoutRouteStopInput>;
};
export type ProofOfDeliveryUpdateWithoutRouteStopInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    photoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signatureUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProofOfDeliveryUncheckedUpdateWithoutRouteStopInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    photoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signatureUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    longitude?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProofOfDeliverySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeStopId?: boolean;
    photoUrl?: boolean;
    signatureUrl?: boolean;
    note?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    capturedAt?: boolean;
    createdAt?: boolean;
    routeStop?: boolean | Prisma.RouteStopDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["proofOfDelivery"]>;
export type ProofOfDeliverySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeStopId?: boolean;
    photoUrl?: boolean;
    signatureUrl?: boolean;
    note?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    capturedAt?: boolean;
    createdAt?: boolean;
    routeStop?: boolean | Prisma.RouteStopDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["proofOfDelivery"]>;
export type ProofOfDeliverySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeStopId?: boolean;
    photoUrl?: boolean;
    signatureUrl?: boolean;
    note?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    capturedAt?: boolean;
    createdAt?: boolean;
    routeStop?: boolean | Prisma.RouteStopDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["proofOfDelivery"]>;
export type ProofOfDeliverySelectScalar = {
    id?: boolean;
    routeStopId?: boolean;
    photoUrl?: boolean;
    signatureUrl?: boolean;
    note?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    capturedAt?: boolean;
    createdAt?: boolean;
};
export type ProofOfDeliveryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "routeStopId" | "photoUrl" | "signatureUrl" | "note" | "latitude" | "longitude" | "capturedAt" | "createdAt", ExtArgs["result"]["proofOfDelivery"]>;
export type ProofOfDeliveryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    routeStop?: boolean | Prisma.RouteStopDefaultArgs<ExtArgs>;
};
export type ProofOfDeliveryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    routeStop?: boolean | Prisma.RouteStopDefaultArgs<ExtArgs>;
};
export type ProofOfDeliveryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    routeStop?: boolean | Prisma.RouteStopDefaultArgs<ExtArgs>;
};
export type $ProofOfDeliveryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProofOfDelivery";
    objects: {
        routeStop: Prisma.$RouteStopPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        routeStopId: string;
        photoUrl: string | null;
        signatureUrl: string | null;
        note: string | null;
        latitude: runtime.Decimal | null;
        longitude: runtime.Decimal | null;
        capturedAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["proofOfDelivery"]>;
    composites: {};
};
export type ProofOfDeliveryGetPayload<S extends boolean | null | undefined | ProofOfDeliveryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload, S>;
export type ProofOfDeliveryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProofOfDeliveryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProofOfDeliveryCountAggregateInputType | true;
};
export interface ProofOfDeliveryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProofOfDelivery'];
        meta: {
            name: 'ProofOfDelivery';
        };
    };
    findUnique<T extends ProofOfDeliveryFindUniqueArgs>(args: Prisma.SelectSubset<T, ProofOfDeliveryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProofOfDeliveryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProofOfDeliveryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProofOfDeliveryFindFirstArgs>(args?: Prisma.SelectSubset<T, ProofOfDeliveryFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProofOfDeliveryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProofOfDeliveryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProofOfDeliveryFindManyArgs>(args?: Prisma.SelectSubset<T, ProofOfDeliveryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProofOfDeliveryCreateArgs>(args: Prisma.SelectSubset<T, ProofOfDeliveryCreateArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProofOfDeliveryCreateManyArgs>(args?: Prisma.SelectSubset<T, ProofOfDeliveryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProofOfDeliveryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProofOfDeliveryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProofOfDeliveryDeleteArgs>(args: Prisma.SelectSubset<T, ProofOfDeliveryDeleteArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProofOfDeliveryUpdateArgs>(args: Prisma.SelectSubset<T, ProofOfDeliveryUpdateArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProofOfDeliveryDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProofOfDeliveryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProofOfDeliveryUpdateManyArgs>(args: Prisma.SelectSubset<T, ProofOfDeliveryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProofOfDeliveryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProofOfDeliveryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProofOfDeliveryUpsertArgs>(args: Prisma.SelectSubset<T, ProofOfDeliveryUpsertArgs<ExtArgs>>): Prisma.Prisma__ProofOfDeliveryClient<runtime.Types.Result.GetResult<Prisma.$ProofOfDeliveryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProofOfDeliveryCountArgs>(args?: Prisma.Subset<T, ProofOfDeliveryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProofOfDeliveryCountAggregateOutputType> : number>;
    aggregate<T extends ProofOfDeliveryAggregateArgs>(args: Prisma.Subset<T, ProofOfDeliveryAggregateArgs>): Prisma.PrismaPromise<GetProofOfDeliveryAggregateType<T>>;
    groupBy<T extends ProofOfDeliveryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProofOfDeliveryGroupByArgs['orderBy'];
    } : {
        orderBy?: ProofOfDeliveryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProofOfDeliveryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProofOfDeliveryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProofOfDeliveryFieldRefs;
}
export interface Prisma__ProofOfDeliveryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    routeStop<T extends Prisma.RouteStopDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RouteStopDefaultArgs<ExtArgs>>): Prisma.Prisma__RouteStopClient<runtime.Types.Result.GetResult<Prisma.$RouteStopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProofOfDeliveryFieldRefs {
    readonly id: Prisma.FieldRef<"ProofOfDelivery", 'String'>;
    readonly routeStopId: Prisma.FieldRef<"ProofOfDelivery", 'String'>;
    readonly photoUrl: Prisma.FieldRef<"ProofOfDelivery", 'String'>;
    readonly signatureUrl: Prisma.FieldRef<"ProofOfDelivery", 'String'>;
    readonly note: Prisma.FieldRef<"ProofOfDelivery", 'String'>;
    readonly latitude: Prisma.FieldRef<"ProofOfDelivery", 'Decimal'>;
    readonly longitude: Prisma.FieldRef<"ProofOfDelivery", 'Decimal'>;
    readonly capturedAt: Prisma.FieldRef<"ProofOfDelivery", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"ProofOfDelivery", 'DateTime'>;
}
export type ProofOfDeliveryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    where: Prisma.ProofOfDeliveryWhereUniqueInput;
};
export type ProofOfDeliveryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    where: Prisma.ProofOfDeliveryWhereUniqueInput;
};
export type ProofOfDeliveryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    where?: Prisma.ProofOfDeliveryWhereInput;
    orderBy?: Prisma.ProofOfDeliveryOrderByWithRelationInput | Prisma.ProofOfDeliveryOrderByWithRelationInput[];
    cursor?: Prisma.ProofOfDeliveryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProofOfDeliveryScalarFieldEnum | Prisma.ProofOfDeliveryScalarFieldEnum[];
};
export type ProofOfDeliveryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    where?: Prisma.ProofOfDeliveryWhereInput;
    orderBy?: Prisma.ProofOfDeliveryOrderByWithRelationInput | Prisma.ProofOfDeliveryOrderByWithRelationInput[];
    cursor?: Prisma.ProofOfDeliveryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProofOfDeliveryScalarFieldEnum | Prisma.ProofOfDeliveryScalarFieldEnum[];
};
export type ProofOfDeliveryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    where?: Prisma.ProofOfDeliveryWhereInput;
    orderBy?: Prisma.ProofOfDeliveryOrderByWithRelationInput | Prisma.ProofOfDeliveryOrderByWithRelationInput[];
    cursor?: Prisma.ProofOfDeliveryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProofOfDeliveryScalarFieldEnum | Prisma.ProofOfDeliveryScalarFieldEnum[];
};
export type ProofOfDeliveryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProofOfDeliveryCreateInput, Prisma.ProofOfDeliveryUncheckedCreateInput>;
};
export type ProofOfDeliveryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProofOfDeliveryCreateManyInput | Prisma.ProofOfDeliveryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProofOfDeliveryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    data: Prisma.ProofOfDeliveryCreateManyInput | Prisma.ProofOfDeliveryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProofOfDeliveryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProofOfDeliveryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProofOfDeliveryUpdateInput, Prisma.ProofOfDeliveryUncheckedUpdateInput>;
    where: Prisma.ProofOfDeliveryWhereUniqueInput;
};
export type ProofOfDeliveryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProofOfDeliveryUpdateManyMutationInput, Prisma.ProofOfDeliveryUncheckedUpdateManyInput>;
    where?: Prisma.ProofOfDeliveryWhereInput;
    limit?: number;
};
export type ProofOfDeliveryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProofOfDeliveryUpdateManyMutationInput, Prisma.ProofOfDeliveryUncheckedUpdateManyInput>;
    where?: Prisma.ProofOfDeliveryWhereInput;
    limit?: number;
    include?: Prisma.ProofOfDeliveryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProofOfDeliveryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    where: Prisma.ProofOfDeliveryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProofOfDeliveryCreateInput, Prisma.ProofOfDeliveryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProofOfDeliveryUpdateInput, Prisma.ProofOfDeliveryUncheckedUpdateInput>;
};
export type ProofOfDeliveryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
    where: Prisma.ProofOfDeliveryWhereUniqueInput;
};
export type ProofOfDeliveryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProofOfDeliveryWhereInput;
    limit?: number;
};
export type ProofOfDeliveryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProofOfDeliverySelect<ExtArgs> | null;
    omit?: Prisma.ProofOfDeliveryOmit<ExtArgs> | null;
    include?: Prisma.ProofOfDeliveryInclude<ExtArgs> | null;
};
