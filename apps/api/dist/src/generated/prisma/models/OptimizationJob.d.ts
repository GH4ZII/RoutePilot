import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type OptimizationJobModel = runtime.Types.Result.DefaultSelection<Prisma.$OptimizationJobPayload>;
export type AggregateOptimizationJob = {
    _count: OptimizationJobCountAggregateOutputType | null;
    _min: OptimizationJobMinAggregateOutputType | null;
    _max: OptimizationJobMaxAggregateOutputType | null;
};
export type OptimizationJobMinAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    status: $Enums.OptimizationJobStatus | null;
    objective: $Enums.OptimizationObjective | null;
    plannedDate: Date | null;
    errorMessage: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OptimizationJobMaxAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    status: $Enums.OptimizationJobStatus | null;
    objective: $Enums.OptimizationObjective | null;
    plannedDate: Date | null;
    errorMessage: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OptimizationJobCountAggregateOutputType = {
    id: number;
    organizationId: number;
    status: number;
    objective: number;
    plannedDate: number;
    request: number;
    result: number;
    errorMessage: number;
    startedAt: number;
    completedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type OptimizationJobMinAggregateInputType = {
    id?: true;
    organizationId?: true;
    status?: true;
    objective?: true;
    plannedDate?: true;
    errorMessage?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OptimizationJobMaxAggregateInputType = {
    id?: true;
    organizationId?: true;
    status?: true;
    objective?: true;
    plannedDate?: true;
    errorMessage?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OptimizationJobCountAggregateInputType = {
    id?: true;
    organizationId?: true;
    status?: true;
    objective?: true;
    plannedDate?: true;
    request?: true;
    result?: true;
    errorMessage?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type OptimizationJobAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OptimizationJobWhereInput;
    orderBy?: Prisma.OptimizationJobOrderByWithRelationInput | Prisma.OptimizationJobOrderByWithRelationInput[];
    cursor?: Prisma.OptimizationJobWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OptimizationJobCountAggregateInputType;
    _min?: OptimizationJobMinAggregateInputType;
    _max?: OptimizationJobMaxAggregateInputType;
};
export type GetOptimizationJobAggregateType<T extends OptimizationJobAggregateArgs> = {
    [P in keyof T & keyof AggregateOptimizationJob]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOptimizationJob[P]> : Prisma.GetScalarType<T[P], AggregateOptimizationJob[P]>;
};
export type OptimizationJobGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OptimizationJobWhereInput;
    orderBy?: Prisma.OptimizationJobOrderByWithAggregationInput | Prisma.OptimizationJobOrderByWithAggregationInput[];
    by: Prisma.OptimizationJobScalarFieldEnum[] | Prisma.OptimizationJobScalarFieldEnum;
    having?: Prisma.OptimizationJobScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OptimizationJobCountAggregateInputType | true;
    _min?: OptimizationJobMinAggregateInputType;
    _max?: OptimizationJobMaxAggregateInputType;
};
export type OptimizationJobGroupByOutputType = {
    id: string;
    organizationId: string;
    status: $Enums.OptimizationJobStatus;
    objective: $Enums.OptimizationObjective;
    plannedDate: Date;
    request: runtime.JsonValue;
    result: runtime.JsonValue | null;
    errorMessage: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: OptimizationJobCountAggregateOutputType | null;
    _min: OptimizationJobMinAggregateOutputType | null;
    _max: OptimizationJobMaxAggregateOutputType | null;
};
export type GetOptimizationJobGroupByPayload<T extends OptimizationJobGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OptimizationJobGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OptimizationJobGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OptimizationJobGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OptimizationJobGroupByOutputType[P]>;
}>>;
export type OptimizationJobWhereInput = {
    AND?: Prisma.OptimizationJobWhereInput | Prisma.OptimizationJobWhereInput[];
    OR?: Prisma.OptimizationJobWhereInput[];
    NOT?: Prisma.OptimizationJobWhereInput | Prisma.OptimizationJobWhereInput[];
    id?: Prisma.StringFilter<"OptimizationJob"> | string;
    organizationId?: Prisma.StringFilter<"OptimizationJob"> | string;
    status?: Prisma.EnumOptimizationJobStatusFilter<"OptimizationJob"> | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFilter<"OptimizationJob"> | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
    request?: Prisma.JsonFilter<"OptimizationJob">;
    result?: Prisma.JsonNullableFilter<"OptimizationJob">;
    errorMessage?: Prisma.StringNullableFilter<"OptimizationJob"> | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"OptimizationJob"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"OptimizationJob"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
};
export type OptimizationJobOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    objective?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    request?: Prisma.SortOrder;
    result?: Prisma.SortOrderInput | Prisma.SortOrder;
    errorMessage?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    organization?: Prisma.OrganizationOrderByWithRelationInput;
};
export type OptimizationJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OptimizationJobWhereInput | Prisma.OptimizationJobWhereInput[];
    OR?: Prisma.OptimizationJobWhereInput[];
    NOT?: Prisma.OptimizationJobWhereInput | Prisma.OptimizationJobWhereInput[];
    organizationId?: Prisma.StringFilter<"OptimizationJob"> | string;
    status?: Prisma.EnumOptimizationJobStatusFilter<"OptimizationJob"> | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFilter<"OptimizationJob"> | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
    request?: Prisma.JsonFilter<"OptimizationJob">;
    result?: Prisma.JsonNullableFilter<"OptimizationJob">;
    errorMessage?: Prisma.StringNullableFilter<"OptimizationJob"> | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"OptimizationJob"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"OptimizationJob"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
}, "id">;
export type OptimizationJobOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    objective?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    request?: Prisma.SortOrder;
    result?: Prisma.SortOrderInput | Prisma.SortOrder;
    errorMessage?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.OptimizationJobCountOrderByAggregateInput;
    _max?: Prisma.OptimizationJobMaxOrderByAggregateInput;
    _min?: Prisma.OptimizationJobMinOrderByAggregateInput;
};
export type OptimizationJobScalarWhereWithAggregatesInput = {
    AND?: Prisma.OptimizationJobScalarWhereWithAggregatesInput | Prisma.OptimizationJobScalarWhereWithAggregatesInput[];
    OR?: Prisma.OptimizationJobScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OptimizationJobScalarWhereWithAggregatesInput | Prisma.OptimizationJobScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"OptimizationJob"> | string;
    organizationId?: Prisma.StringWithAggregatesFilter<"OptimizationJob"> | string;
    status?: Prisma.EnumOptimizationJobStatusWithAggregatesFilter<"OptimizationJob"> | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveWithAggregatesFilter<"OptimizationJob"> | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeWithAggregatesFilter<"OptimizationJob"> | Date | string;
    request?: Prisma.JsonWithAggregatesFilter<"OptimizationJob">;
    result?: Prisma.JsonNullableWithAggregatesFilter<"OptimizationJob">;
    errorMessage?: Prisma.StringNullableWithAggregatesFilter<"OptimizationJob"> | string | null;
    startedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"OptimizationJob"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"OptimizationJob"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"OptimizationJob"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"OptimizationJob"> | Date | string;
};
export type OptimizationJobCreateInput = {
    id?: string;
    status?: $Enums.OptimizationJobStatus;
    objective?: $Enums.OptimizationObjective;
    plannedDate: Date | string;
    request: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutOptimizationJobsInput;
};
export type OptimizationJobUncheckedCreateInput = {
    id?: string;
    organizationId: string;
    status?: $Enums.OptimizationJobStatus;
    objective?: $Enums.OptimizationObjective;
    plannedDate: Date | string;
    request: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OptimizationJobUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOptimizationJobStatusFieldUpdateOperationsInput | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFieldUpdateOperationsInput | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutOptimizationJobsNestedInput;
};
export type OptimizationJobUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOptimizationJobStatusFieldUpdateOperationsInput | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFieldUpdateOperationsInput | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OptimizationJobCreateManyInput = {
    id?: string;
    organizationId: string;
    status?: $Enums.OptimizationJobStatus;
    objective?: $Enums.OptimizationObjective;
    plannedDate: Date | string;
    request: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OptimizationJobUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOptimizationJobStatusFieldUpdateOperationsInput | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFieldUpdateOperationsInput | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OptimizationJobUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOptimizationJobStatusFieldUpdateOperationsInput | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFieldUpdateOperationsInput | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OptimizationJobListRelationFilter = {
    every?: Prisma.OptimizationJobWhereInput;
    some?: Prisma.OptimizationJobWhereInput;
    none?: Prisma.OptimizationJobWhereInput;
};
export type OptimizationJobOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OptimizationJobCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    objective?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    request?: Prisma.SortOrder;
    result?: Prisma.SortOrder;
    errorMessage?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OptimizationJobMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    objective?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    errorMessage?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OptimizationJobMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    objective?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    errorMessage?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OptimizationJobCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.OptimizationJobCreateWithoutOrganizationInput, Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput> | Prisma.OptimizationJobCreateWithoutOrganizationInput[] | Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.OptimizationJobCreateOrConnectWithoutOrganizationInput | Prisma.OptimizationJobCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.OptimizationJobCreateManyOrganizationInputEnvelope;
    connect?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
};
export type OptimizationJobUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.OptimizationJobCreateWithoutOrganizationInput, Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput> | Prisma.OptimizationJobCreateWithoutOrganizationInput[] | Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.OptimizationJobCreateOrConnectWithoutOrganizationInput | Prisma.OptimizationJobCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.OptimizationJobCreateManyOrganizationInputEnvelope;
    connect?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
};
export type OptimizationJobUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.OptimizationJobCreateWithoutOrganizationInput, Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput> | Prisma.OptimizationJobCreateWithoutOrganizationInput[] | Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.OptimizationJobCreateOrConnectWithoutOrganizationInput | Prisma.OptimizationJobCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.OptimizationJobUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.OptimizationJobUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.OptimizationJobCreateManyOrganizationInputEnvelope;
    set?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
    disconnect?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
    delete?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
    connect?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
    update?: Prisma.OptimizationJobUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.OptimizationJobUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.OptimizationJobUpdateManyWithWhereWithoutOrganizationInput | Prisma.OptimizationJobUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.OptimizationJobScalarWhereInput | Prisma.OptimizationJobScalarWhereInput[];
};
export type OptimizationJobUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.OptimizationJobCreateWithoutOrganizationInput, Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput> | Prisma.OptimizationJobCreateWithoutOrganizationInput[] | Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.OptimizationJobCreateOrConnectWithoutOrganizationInput | Prisma.OptimizationJobCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.OptimizationJobUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.OptimizationJobUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.OptimizationJobCreateManyOrganizationInputEnvelope;
    set?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
    disconnect?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
    delete?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
    connect?: Prisma.OptimizationJobWhereUniqueInput | Prisma.OptimizationJobWhereUniqueInput[];
    update?: Prisma.OptimizationJobUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.OptimizationJobUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.OptimizationJobUpdateManyWithWhereWithoutOrganizationInput | Prisma.OptimizationJobUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.OptimizationJobScalarWhereInput | Prisma.OptimizationJobScalarWhereInput[];
};
export type EnumOptimizationJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.OptimizationJobStatus;
};
export type EnumOptimizationObjectiveFieldUpdateOperationsInput = {
    set?: $Enums.OptimizationObjective;
};
export type OptimizationJobCreateWithoutOrganizationInput = {
    id?: string;
    status?: $Enums.OptimizationJobStatus;
    objective?: $Enums.OptimizationObjective;
    plannedDate: Date | string;
    request: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OptimizationJobUncheckedCreateWithoutOrganizationInput = {
    id?: string;
    status?: $Enums.OptimizationJobStatus;
    objective?: $Enums.OptimizationObjective;
    plannedDate: Date | string;
    request: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OptimizationJobCreateOrConnectWithoutOrganizationInput = {
    where: Prisma.OptimizationJobWhereUniqueInput;
    create: Prisma.XOR<Prisma.OptimizationJobCreateWithoutOrganizationInput, Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput>;
};
export type OptimizationJobCreateManyOrganizationInputEnvelope = {
    data: Prisma.OptimizationJobCreateManyOrganizationInput | Prisma.OptimizationJobCreateManyOrganizationInput[];
    skipDuplicates?: boolean;
};
export type OptimizationJobUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.OptimizationJobWhereUniqueInput;
    update: Prisma.XOR<Prisma.OptimizationJobUpdateWithoutOrganizationInput, Prisma.OptimizationJobUncheckedUpdateWithoutOrganizationInput>;
    create: Prisma.XOR<Prisma.OptimizationJobCreateWithoutOrganizationInput, Prisma.OptimizationJobUncheckedCreateWithoutOrganizationInput>;
};
export type OptimizationJobUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.OptimizationJobWhereUniqueInput;
    data: Prisma.XOR<Prisma.OptimizationJobUpdateWithoutOrganizationInput, Prisma.OptimizationJobUncheckedUpdateWithoutOrganizationInput>;
};
export type OptimizationJobUpdateManyWithWhereWithoutOrganizationInput = {
    where: Prisma.OptimizationJobScalarWhereInput;
    data: Prisma.XOR<Prisma.OptimizationJobUpdateManyMutationInput, Prisma.OptimizationJobUncheckedUpdateManyWithoutOrganizationInput>;
};
export type OptimizationJobScalarWhereInput = {
    AND?: Prisma.OptimizationJobScalarWhereInput | Prisma.OptimizationJobScalarWhereInput[];
    OR?: Prisma.OptimizationJobScalarWhereInput[];
    NOT?: Prisma.OptimizationJobScalarWhereInput | Prisma.OptimizationJobScalarWhereInput[];
    id?: Prisma.StringFilter<"OptimizationJob"> | string;
    organizationId?: Prisma.StringFilter<"OptimizationJob"> | string;
    status?: Prisma.EnumOptimizationJobStatusFilter<"OptimizationJob"> | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFilter<"OptimizationJob"> | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
    request?: Prisma.JsonFilter<"OptimizationJob">;
    result?: Prisma.JsonNullableFilter<"OptimizationJob">;
    errorMessage?: Prisma.StringNullableFilter<"OptimizationJob"> | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"OptimizationJob"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"OptimizationJob"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"OptimizationJob"> | Date | string;
};
export type OptimizationJobCreateManyOrganizationInput = {
    id?: string;
    status?: $Enums.OptimizationJobStatus;
    objective?: $Enums.OptimizationObjective;
    plannedDate: Date | string;
    request: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OptimizationJobUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOptimizationJobStatusFieldUpdateOperationsInput | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFieldUpdateOperationsInput | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OptimizationJobUncheckedUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOptimizationJobStatusFieldUpdateOperationsInput | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFieldUpdateOperationsInput | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OptimizationJobUncheckedUpdateManyWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOptimizationJobStatusFieldUpdateOperationsInput | $Enums.OptimizationJobStatus;
    objective?: Prisma.EnumOptimizationObjectiveFieldUpdateOperationsInput | $Enums.OptimizationObjective;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    result?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    errorMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OptimizationJobSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    status?: boolean;
    objective?: boolean;
    plannedDate?: boolean;
    request?: boolean;
    result?: boolean;
    errorMessage?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["optimizationJob"]>;
export type OptimizationJobSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    status?: boolean;
    objective?: boolean;
    plannedDate?: boolean;
    request?: boolean;
    result?: boolean;
    errorMessage?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["optimizationJob"]>;
export type OptimizationJobSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    status?: boolean;
    objective?: boolean;
    plannedDate?: boolean;
    request?: boolean;
    result?: boolean;
    errorMessage?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["optimizationJob"]>;
export type OptimizationJobSelectScalar = {
    id?: boolean;
    organizationId?: boolean;
    status?: boolean;
    objective?: boolean;
    plannedDate?: boolean;
    request?: boolean;
    result?: boolean;
    errorMessage?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type OptimizationJobOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "organizationId" | "status" | "objective" | "plannedDate" | "request" | "result" | "errorMessage" | "startedAt" | "completedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["optimizationJob"]>;
export type OptimizationJobInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type OptimizationJobIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type OptimizationJobIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type $OptimizationJobPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OptimizationJob";
    objects: {
        organization: Prisma.$OrganizationPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        organizationId: string;
        status: $Enums.OptimizationJobStatus;
        objective: $Enums.OptimizationObjective;
        plannedDate: Date;
        request: runtime.JsonValue;
        result: runtime.JsonValue | null;
        errorMessage: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["optimizationJob"]>;
    composites: {};
};
export type OptimizationJobGetPayload<S extends boolean | null | undefined | OptimizationJobDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload, S>;
export type OptimizationJobCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OptimizationJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OptimizationJobCountAggregateInputType | true;
};
export interface OptimizationJobDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OptimizationJob'];
        meta: {
            name: 'OptimizationJob';
        };
    };
    findUnique<T extends OptimizationJobFindUniqueArgs>(args: Prisma.SelectSubset<T, OptimizationJobFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OptimizationJobClient<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OptimizationJobFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OptimizationJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OptimizationJobClient<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OptimizationJobFindFirstArgs>(args?: Prisma.SelectSubset<T, OptimizationJobFindFirstArgs<ExtArgs>>): Prisma.Prisma__OptimizationJobClient<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OptimizationJobFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OptimizationJobFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OptimizationJobClient<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OptimizationJobFindManyArgs>(args?: Prisma.SelectSubset<T, OptimizationJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OptimizationJobCreateArgs>(args: Prisma.SelectSubset<T, OptimizationJobCreateArgs<ExtArgs>>): Prisma.Prisma__OptimizationJobClient<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OptimizationJobCreateManyArgs>(args?: Prisma.SelectSubset<T, OptimizationJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OptimizationJobCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OptimizationJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OptimizationJobDeleteArgs>(args: Prisma.SelectSubset<T, OptimizationJobDeleteArgs<ExtArgs>>): Prisma.Prisma__OptimizationJobClient<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OptimizationJobUpdateArgs>(args: Prisma.SelectSubset<T, OptimizationJobUpdateArgs<ExtArgs>>): Prisma.Prisma__OptimizationJobClient<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OptimizationJobDeleteManyArgs>(args?: Prisma.SelectSubset<T, OptimizationJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OptimizationJobUpdateManyArgs>(args: Prisma.SelectSubset<T, OptimizationJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OptimizationJobUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OptimizationJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OptimizationJobUpsertArgs>(args: Prisma.SelectSubset<T, OptimizationJobUpsertArgs<ExtArgs>>): Prisma.Prisma__OptimizationJobClient<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OptimizationJobCountArgs>(args?: Prisma.Subset<T, OptimizationJobCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OptimizationJobCountAggregateOutputType> : number>;
    aggregate<T extends OptimizationJobAggregateArgs>(args: Prisma.Subset<T, OptimizationJobAggregateArgs>): Prisma.PrismaPromise<GetOptimizationJobAggregateType<T>>;
    groupBy<T extends OptimizationJobGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OptimizationJobGroupByArgs['orderBy'];
    } : {
        orderBy?: OptimizationJobGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OptimizationJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOptimizationJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OptimizationJobFieldRefs;
}
export interface Prisma__OptimizationJobClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    organization<T extends Prisma.OrganizationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationDefaultArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OptimizationJobFieldRefs {
    readonly id: Prisma.FieldRef<"OptimizationJob", 'String'>;
    readonly organizationId: Prisma.FieldRef<"OptimizationJob", 'String'>;
    readonly status: Prisma.FieldRef<"OptimizationJob", 'OptimizationJobStatus'>;
    readonly objective: Prisma.FieldRef<"OptimizationJob", 'OptimizationObjective'>;
    readonly plannedDate: Prisma.FieldRef<"OptimizationJob", 'DateTime'>;
    readonly request: Prisma.FieldRef<"OptimizationJob", 'Json'>;
    readonly result: Prisma.FieldRef<"OptimizationJob", 'Json'>;
    readonly errorMessage: Prisma.FieldRef<"OptimizationJob", 'String'>;
    readonly startedAt: Prisma.FieldRef<"OptimizationJob", 'DateTime'>;
    readonly completedAt: Prisma.FieldRef<"OptimizationJob", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"OptimizationJob", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"OptimizationJob", 'DateTime'>;
}
export type OptimizationJobFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    where: Prisma.OptimizationJobWhereUniqueInput;
};
export type OptimizationJobFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    where: Prisma.OptimizationJobWhereUniqueInput;
};
export type OptimizationJobFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    where?: Prisma.OptimizationJobWhereInput;
    orderBy?: Prisma.OptimizationJobOrderByWithRelationInput | Prisma.OptimizationJobOrderByWithRelationInput[];
    cursor?: Prisma.OptimizationJobWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OptimizationJobScalarFieldEnum | Prisma.OptimizationJobScalarFieldEnum[];
};
export type OptimizationJobFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    where?: Prisma.OptimizationJobWhereInput;
    orderBy?: Prisma.OptimizationJobOrderByWithRelationInput | Prisma.OptimizationJobOrderByWithRelationInput[];
    cursor?: Prisma.OptimizationJobWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OptimizationJobScalarFieldEnum | Prisma.OptimizationJobScalarFieldEnum[];
};
export type OptimizationJobFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    where?: Prisma.OptimizationJobWhereInput;
    orderBy?: Prisma.OptimizationJobOrderByWithRelationInput | Prisma.OptimizationJobOrderByWithRelationInput[];
    cursor?: Prisma.OptimizationJobWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OptimizationJobScalarFieldEnum | Prisma.OptimizationJobScalarFieldEnum[];
};
export type OptimizationJobCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OptimizationJobCreateInput, Prisma.OptimizationJobUncheckedCreateInput>;
};
export type OptimizationJobCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OptimizationJobCreateManyInput | Prisma.OptimizationJobCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OptimizationJobCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    data: Prisma.OptimizationJobCreateManyInput | Prisma.OptimizationJobCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OptimizationJobIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OptimizationJobUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OptimizationJobUpdateInput, Prisma.OptimizationJobUncheckedUpdateInput>;
    where: Prisma.OptimizationJobWhereUniqueInput;
};
export type OptimizationJobUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OptimizationJobUpdateManyMutationInput, Prisma.OptimizationJobUncheckedUpdateManyInput>;
    where?: Prisma.OptimizationJobWhereInput;
    limit?: number;
};
export type OptimizationJobUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OptimizationJobUpdateManyMutationInput, Prisma.OptimizationJobUncheckedUpdateManyInput>;
    where?: Prisma.OptimizationJobWhereInput;
    limit?: number;
    include?: Prisma.OptimizationJobIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OptimizationJobUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    where: Prisma.OptimizationJobWhereUniqueInput;
    create: Prisma.XOR<Prisma.OptimizationJobCreateInput, Prisma.OptimizationJobUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OptimizationJobUpdateInput, Prisma.OptimizationJobUncheckedUpdateInput>;
};
export type OptimizationJobDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
    where: Prisma.OptimizationJobWhereUniqueInput;
};
export type OptimizationJobDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OptimizationJobWhereInput;
    limit?: number;
};
export type OptimizationJobDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OptimizationJobSelect<ExtArgs> | null;
    omit?: Prisma.OptimizationJobOmit<ExtArgs> | null;
    include?: Prisma.OptimizationJobInclude<ExtArgs> | null;
};
