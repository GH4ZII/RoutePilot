import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RouteEventModel = runtime.Types.Result.DefaultSelection<Prisma.$RouteEventPayload>;
export type AggregateRouteEvent = {
    _count: RouteEventCountAggregateOutputType | null;
    _min: RouteEventMinAggregateOutputType | null;
    _max: RouteEventMaxAggregateOutputType | null;
};
export type RouteEventMinAggregateOutputType = {
    id: string | null;
    routeId: string | null;
    type: $Enums.RouteEventType | null;
    createdAt: Date | null;
};
export type RouteEventMaxAggregateOutputType = {
    id: string | null;
    routeId: string | null;
    type: $Enums.RouteEventType | null;
    createdAt: Date | null;
};
export type RouteEventCountAggregateOutputType = {
    id: number;
    routeId: number;
    type: number;
    metadata: number;
    createdAt: number;
    _all: number;
};
export type RouteEventMinAggregateInputType = {
    id?: true;
    routeId?: true;
    type?: true;
    createdAt?: true;
};
export type RouteEventMaxAggregateInputType = {
    id?: true;
    routeId?: true;
    type?: true;
    createdAt?: true;
};
export type RouteEventCountAggregateInputType = {
    id?: true;
    routeId?: true;
    type?: true;
    metadata?: true;
    createdAt?: true;
    _all?: true;
};
export type RouteEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteEventWhereInput;
    orderBy?: Prisma.RouteEventOrderByWithRelationInput | Prisma.RouteEventOrderByWithRelationInput[];
    cursor?: Prisma.RouteEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RouteEventCountAggregateInputType;
    _min?: RouteEventMinAggregateInputType;
    _max?: RouteEventMaxAggregateInputType;
};
export type GetRouteEventAggregateType<T extends RouteEventAggregateArgs> = {
    [P in keyof T & keyof AggregateRouteEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRouteEvent[P]> : Prisma.GetScalarType<T[P], AggregateRouteEvent[P]>;
};
export type RouteEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteEventWhereInput;
    orderBy?: Prisma.RouteEventOrderByWithAggregationInput | Prisma.RouteEventOrderByWithAggregationInput[];
    by: Prisma.RouteEventScalarFieldEnum[] | Prisma.RouteEventScalarFieldEnum;
    having?: Prisma.RouteEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RouteEventCountAggregateInputType | true;
    _min?: RouteEventMinAggregateInputType;
    _max?: RouteEventMaxAggregateInputType;
};
export type RouteEventGroupByOutputType = {
    id: string;
    routeId: string;
    type: $Enums.RouteEventType;
    metadata: runtime.JsonValue | null;
    createdAt: Date;
    _count: RouteEventCountAggregateOutputType | null;
    _min: RouteEventMinAggregateOutputType | null;
    _max: RouteEventMaxAggregateOutputType | null;
};
export type GetRouteEventGroupByPayload<T extends RouteEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RouteEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RouteEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RouteEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RouteEventGroupByOutputType[P]>;
}>>;
export type RouteEventWhereInput = {
    AND?: Prisma.RouteEventWhereInput | Prisma.RouteEventWhereInput[];
    OR?: Prisma.RouteEventWhereInput[];
    NOT?: Prisma.RouteEventWhereInput | Prisma.RouteEventWhereInput[];
    id?: Prisma.StringFilter<"RouteEvent"> | string;
    routeId?: Prisma.StringFilter<"RouteEvent"> | string;
    type?: Prisma.EnumRouteEventTypeFilter<"RouteEvent"> | $Enums.RouteEventType;
    metadata?: Prisma.JsonNullableFilter<"RouteEvent">;
    createdAt?: Prisma.DateTimeFilter<"RouteEvent"> | Date | string;
    route?: Prisma.XOR<Prisma.RouteScalarRelationFilter, Prisma.RouteWhereInput>;
};
export type RouteEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    route?: Prisma.RouteOrderByWithRelationInput;
};
export type RouteEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RouteEventWhereInput | Prisma.RouteEventWhereInput[];
    OR?: Prisma.RouteEventWhereInput[];
    NOT?: Prisma.RouteEventWhereInput | Prisma.RouteEventWhereInput[];
    routeId?: Prisma.StringFilter<"RouteEvent"> | string;
    type?: Prisma.EnumRouteEventTypeFilter<"RouteEvent"> | $Enums.RouteEventType;
    metadata?: Prisma.JsonNullableFilter<"RouteEvent">;
    createdAt?: Prisma.DateTimeFilter<"RouteEvent"> | Date | string;
    route?: Prisma.XOR<Prisma.RouteScalarRelationFilter, Prisma.RouteWhereInput>;
}, "id">;
export type RouteEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RouteEventCountOrderByAggregateInput;
    _max?: Prisma.RouteEventMaxOrderByAggregateInput;
    _min?: Prisma.RouteEventMinOrderByAggregateInput;
};
export type RouteEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.RouteEventScalarWhereWithAggregatesInput | Prisma.RouteEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.RouteEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RouteEventScalarWhereWithAggregatesInput | Prisma.RouteEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RouteEvent"> | string;
    routeId?: Prisma.StringWithAggregatesFilter<"RouteEvent"> | string;
    type?: Prisma.EnumRouteEventTypeWithAggregatesFilter<"RouteEvent"> | $Enums.RouteEventType;
    metadata?: Prisma.JsonNullableWithAggregatesFilter<"RouteEvent">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RouteEvent"> | Date | string;
};
export type RouteEventCreateInput = {
    id?: string;
    type: $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    route: Prisma.RouteCreateNestedOneWithoutEventsInput;
};
export type RouteEventUncheckedCreateInput = {
    id?: string;
    routeId: string;
    type: $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type RouteEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRouteEventTypeFieldUpdateOperationsInput | $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    route?: Prisma.RouteUpdateOneRequiredWithoutEventsNestedInput;
};
export type RouteEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRouteEventTypeFieldUpdateOperationsInput | $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteEventCreateManyInput = {
    id?: string;
    routeId: string;
    type: $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type RouteEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRouteEventTypeFieldUpdateOperationsInput | $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    routeId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRouteEventTypeFieldUpdateOperationsInput | $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteEventListRelationFilter = {
    every?: Prisma.RouteEventWhereInput;
    some?: Prisma.RouteEventWhereInput;
    none?: Prisma.RouteEventWhereInput;
};
export type RouteEventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RouteEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RouteEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RouteEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    routeId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RouteEventCreateNestedManyWithoutRouteInput = {
    create?: Prisma.XOR<Prisma.RouteEventCreateWithoutRouteInput, Prisma.RouteEventUncheckedCreateWithoutRouteInput> | Prisma.RouteEventCreateWithoutRouteInput[] | Prisma.RouteEventUncheckedCreateWithoutRouteInput[];
    connectOrCreate?: Prisma.RouteEventCreateOrConnectWithoutRouteInput | Prisma.RouteEventCreateOrConnectWithoutRouteInput[];
    createMany?: Prisma.RouteEventCreateManyRouteInputEnvelope;
    connect?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
};
export type RouteEventUncheckedCreateNestedManyWithoutRouteInput = {
    create?: Prisma.XOR<Prisma.RouteEventCreateWithoutRouteInput, Prisma.RouteEventUncheckedCreateWithoutRouteInput> | Prisma.RouteEventCreateWithoutRouteInput[] | Prisma.RouteEventUncheckedCreateWithoutRouteInput[];
    connectOrCreate?: Prisma.RouteEventCreateOrConnectWithoutRouteInput | Prisma.RouteEventCreateOrConnectWithoutRouteInput[];
    createMany?: Prisma.RouteEventCreateManyRouteInputEnvelope;
    connect?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
};
export type RouteEventUpdateManyWithoutRouteNestedInput = {
    create?: Prisma.XOR<Prisma.RouteEventCreateWithoutRouteInput, Prisma.RouteEventUncheckedCreateWithoutRouteInput> | Prisma.RouteEventCreateWithoutRouteInput[] | Prisma.RouteEventUncheckedCreateWithoutRouteInput[];
    connectOrCreate?: Prisma.RouteEventCreateOrConnectWithoutRouteInput | Prisma.RouteEventCreateOrConnectWithoutRouteInput[];
    upsert?: Prisma.RouteEventUpsertWithWhereUniqueWithoutRouteInput | Prisma.RouteEventUpsertWithWhereUniqueWithoutRouteInput[];
    createMany?: Prisma.RouteEventCreateManyRouteInputEnvelope;
    set?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
    disconnect?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
    delete?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
    connect?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
    update?: Prisma.RouteEventUpdateWithWhereUniqueWithoutRouteInput | Prisma.RouteEventUpdateWithWhereUniqueWithoutRouteInput[];
    updateMany?: Prisma.RouteEventUpdateManyWithWhereWithoutRouteInput | Prisma.RouteEventUpdateManyWithWhereWithoutRouteInput[];
    deleteMany?: Prisma.RouteEventScalarWhereInput | Prisma.RouteEventScalarWhereInput[];
};
export type RouteEventUncheckedUpdateManyWithoutRouteNestedInput = {
    create?: Prisma.XOR<Prisma.RouteEventCreateWithoutRouteInput, Prisma.RouteEventUncheckedCreateWithoutRouteInput> | Prisma.RouteEventCreateWithoutRouteInput[] | Prisma.RouteEventUncheckedCreateWithoutRouteInput[];
    connectOrCreate?: Prisma.RouteEventCreateOrConnectWithoutRouteInput | Prisma.RouteEventCreateOrConnectWithoutRouteInput[];
    upsert?: Prisma.RouteEventUpsertWithWhereUniqueWithoutRouteInput | Prisma.RouteEventUpsertWithWhereUniqueWithoutRouteInput[];
    createMany?: Prisma.RouteEventCreateManyRouteInputEnvelope;
    set?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
    disconnect?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
    delete?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
    connect?: Prisma.RouteEventWhereUniqueInput | Prisma.RouteEventWhereUniqueInput[];
    update?: Prisma.RouteEventUpdateWithWhereUniqueWithoutRouteInput | Prisma.RouteEventUpdateWithWhereUniqueWithoutRouteInput[];
    updateMany?: Prisma.RouteEventUpdateManyWithWhereWithoutRouteInput | Prisma.RouteEventUpdateManyWithWhereWithoutRouteInput[];
    deleteMany?: Prisma.RouteEventScalarWhereInput | Prisma.RouteEventScalarWhereInput[];
};
export type EnumRouteEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.RouteEventType;
};
export type RouteEventCreateWithoutRouteInput = {
    id?: string;
    type: $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type RouteEventUncheckedCreateWithoutRouteInput = {
    id?: string;
    type: $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type RouteEventCreateOrConnectWithoutRouteInput = {
    where: Prisma.RouteEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteEventCreateWithoutRouteInput, Prisma.RouteEventUncheckedCreateWithoutRouteInput>;
};
export type RouteEventCreateManyRouteInputEnvelope = {
    data: Prisma.RouteEventCreateManyRouteInput | Prisma.RouteEventCreateManyRouteInput[];
    skipDuplicates?: boolean;
};
export type RouteEventUpsertWithWhereUniqueWithoutRouteInput = {
    where: Prisma.RouteEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.RouteEventUpdateWithoutRouteInput, Prisma.RouteEventUncheckedUpdateWithoutRouteInput>;
    create: Prisma.XOR<Prisma.RouteEventCreateWithoutRouteInput, Prisma.RouteEventUncheckedCreateWithoutRouteInput>;
};
export type RouteEventUpdateWithWhereUniqueWithoutRouteInput = {
    where: Prisma.RouteEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.RouteEventUpdateWithoutRouteInput, Prisma.RouteEventUncheckedUpdateWithoutRouteInput>;
};
export type RouteEventUpdateManyWithWhereWithoutRouteInput = {
    where: Prisma.RouteEventScalarWhereInput;
    data: Prisma.XOR<Prisma.RouteEventUpdateManyMutationInput, Prisma.RouteEventUncheckedUpdateManyWithoutRouteInput>;
};
export type RouteEventScalarWhereInput = {
    AND?: Prisma.RouteEventScalarWhereInput | Prisma.RouteEventScalarWhereInput[];
    OR?: Prisma.RouteEventScalarWhereInput[];
    NOT?: Prisma.RouteEventScalarWhereInput | Prisma.RouteEventScalarWhereInput[];
    id?: Prisma.StringFilter<"RouteEvent"> | string;
    routeId?: Prisma.StringFilter<"RouteEvent"> | string;
    type?: Prisma.EnumRouteEventTypeFilter<"RouteEvent"> | $Enums.RouteEventType;
    metadata?: Prisma.JsonNullableFilter<"RouteEvent">;
    createdAt?: Prisma.DateTimeFilter<"RouteEvent"> | Date | string;
};
export type RouteEventCreateManyRouteInput = {
    id?: string;
    type: $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type RouteEventUpdateWithoutRouteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRouteEventTypeFieldUpdateOperationsInput | $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteEventUncheckedUpdateWithoutRouteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRouteEventTypeFieldUpdateOperationsInput | $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteEventUncheckedUpdateManyWithoutRouteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRouteEventTypeFieldUpdateOperationsInput | $Enums.RouteEventType;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RouteEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeId?: boolean;
    type?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["routeEvent"]>;
export type RouteEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeId?: boolean;
    type?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["routeEvent"]>;
export type RouteEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    routeId?: boolean;
    type?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["routeEvent"]>;
export type RouteEventSelectScalar = {
    id?: boolean;
    routeId?: boolean;
    type?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
};
export type RouteEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "routeId" | "type" | "metadata" | "createdAt", ExtArgs["result"]["routeEvent"]>;
export type RouteEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
};
export type RouteEventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
};
export type RouteEventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    route?: boolean | Prisma.RouteDefaultArgs<ExtArgs>;
};
export type $RouteEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RouteEvent";
    objects: {
        route: Prisma.$RoutePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        routeId: string;
        type: $Enums.RouteEventType;
        metadata: runtime.JsonValue | null;
        createdAt: Date;
    }, ExtArgs["result"]["routeEvent"]>;
    composites: {};
};
export type RouteEventGetPayload<S extends boolean | null | undefined | RouteEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RouteEventPayload, S>;
export type RouteEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RouteEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RouteEventCountAggregateInputType | true;
};
export interface RouteEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RouteEvent'];
        meta: {
            name: 'RouteEvent';
        };
    };
    findUnique<T extends RouteEventFindUniqueArgs>(args: Prisma.SelectSubset<T, RouteEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RouteEventClient<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RouteEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RouteEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RouteEventClient<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RouteEventFindFirstArgs>(args?: Prisma.SelectSubset<T, RouteEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__RouteEventClient<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RouteEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RouteEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RouteEventClient<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RouteEventFindManyArgs>(args?: Prisma.SelectSubset<T, RouteEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RouteEventCreateArgs>(args: Prisma.SelectSubset<T, RouteEventCreateArgs<ExtArgs>>): Prisma.Prisma__RouteEventClient<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RouteEventCreateManyArgs>(args?: Prisma.SelectSubset<T, RouteEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RouteEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RouteEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RouteEventDeleteArgs>(args: Prisma.SelectSubset<T, RouteEventDeleteArgs<ExtArgs>>): Prisma.Prisma__RouteEventClient<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RouteEventUpdateArgs>(args: Prisma.SelectSubset<T, RouteEventUpdateArgs<ExtArgs>>): Prisma.Prisma__RouteEventClient<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RouteEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, RouteEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RouteEventUpdateManyArgs>(args: Prisma.SelectSubset<T, RouteEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RouteEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RouteEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RouteEventUpsertArgs>(args: Prisma.SelectSubset<T, RouteEventUpsertArgs<ExtArgs>>): Prisma.Prisma__RouteEventClient<runtime.Types.Result.GetResult<Prisma.$RouteEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RouteEventCountArgs>(args?: Prisma.Subset<T, RouteEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RouteEventCountAggregateOutputType> : number>;
    aggregate<T extends RouteEventAggregateArgs>(args: Prisma.Subset<T, RouteEventAggregateArgs>): Prisma.PrismaPromise<GetRouteEventAggregateType<T>>;
    groupBy<T extends RouteEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RouteEventGroupByArgs['orderBy'];
    } : {
        orderBy?: RouteEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RouteEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRouteEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RouteEventFieldRefs;
}
export interface Prisma__RouteEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    route<T extends Prisma.RouteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RouteDefaultArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RouteEventFieldRefs {
    readonly id: Prisma.FieldRef<"RouteEvent", 'String'>;
    readonly routeId: Prisma.FieldRef<"RouteEvent", 'String'>;
    readonly type: Prisma.FieldRef<"RouteEvent", 'RouteEventType'>;
    readonly metadata: Prisma.FieldRef<"RouteEvent", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"RouteEvent", 'DateTime'>;
}
export type RouteEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelect<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    include?: Prisma.RouteEventInclude<ExtArgs> | null;
    where: Prisma.RouteEventWhereUniqueInput;
};
export type RouteEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelect<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    include?: Prisma.RouteEventInclude<ExtArgs> | null;
    where: Prisma.RouteEventWhereUniqueInput;
};
export type RouteEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RouteEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RouteEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RouteEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelect<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    include?: Prisma.RouteEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteEventCreateInput, Prisma.RouteEventUncheckedCreateInput>;
};
export type RouteEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RouteEventCreateManyInput | Prisma.RouteEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RouteEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    data: Prisma.RouteEventCreateManyInput | Prisma.RouteEventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RouteEventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RouteEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelect<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    include?: Prisma.RouteEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteEventUpdateInput, Prisma.RouteEventUncheckedUpdateInput>;
    where: Prisma.RouteEventWhereUniqueInput;
};
export type RouteEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RouteEventUpdateManyMutationInput, Prisma.RouteEventUncheckedUpdateManyInput>;
    where?: Prisma.RouteEventWhereInput;
    limit?: number;
};
export type RouteEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RouteEventUpdateManyMutationInput, Prisma.RouteEventUncheckedUpdateManyInput>;
    where?: Prisma.RouteEventWhereInput;
    limit?: number;
    include?: Prisma.RouteEventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RouteEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelect<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    include?: Prisma.RouteEventInclude<ExtArgs> | null;
    where: Prisma.RouteEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.RouteEventCreateInput, Prisma.RouteEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RouteEventUpdateInput, Prisma.RouteEventUncheckedUpdateInput>;
};
export type RouteEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelect<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    include?: Prisma.RouteEventInclude<ExtArgs> | null;
    where: Prisma.RouteEventWhereUniqueInput;
};
export type RouteEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteEventWhereInput;
    limit?: number;
};
export type RouteEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteEventSelect<ExtArgs> | null;
    omit?: Prisma.RouteEventOmit<ExtArgs> | null;
    include?: Prisma.RouteEventInclude<ExtArgs> | null;
};
