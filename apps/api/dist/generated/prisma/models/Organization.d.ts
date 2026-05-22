import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type OrganizationModel = runtime.Types.Result.DefaultSelection<Prisma.$OrganizationPayload>;
export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null;
    _min: OrganizationMinAggregateOutputType | null;
    _max: OrganizationMaxAggregateOutputType | null;
};
export type OrganizationMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OrganizationMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OrganizationCountAggregateOutputType = {
    id: number;
    name: number;
    slug: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type OrganizationMinAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OrganizationMaxAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OrganizationCountAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type OrganizationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrganizationCountAggregateInputType;
    _min?: OrganizationMinAggregateInputType;
    _max?: OrganizationMaxAggregateInputType;
};
export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
    [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrganization[P]> : Prisma.GetScalarType<T[P], AggregateOrganization[P]>;
};
export type OrganizationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithAggregationInput | Prisma.OrganizationOrderByWithAggregationInput[];
    by: Prisma.OrganizationScalarFieldEnum[] | Prisma.OrganizationScalarFieldEnum;
    having?: Prisma.OrganizationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrganizationCountAggregateInputType | true;
    _min?: OrganizationMinAggregateInputType;
    _max?: OrganizationMaxAggregateInputType;
};
export type OrganizationGroupByOutputType = {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    _count: OrganizationCountAggregateOutputType | null;
    _min: OrganizationMinAggregateOutputType | null;
    _max: OrganizationMaxAggregateOutputType | null;
};
export type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrganizationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrganizationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrganizationGroupByOutputType[P]>;
}>>;
export type OrganizationWhereInput = {
    AND?: Prisma.OrganizationWhereInput | Prisma.OrganizationWhereInput[];
    OR?: Prisma.OrganizationWhereInput[];
    NOT?: Prisma.OrganizationWhereInput | Prisma.OrganizationWhereInput[];
    id?: Prisma.StringFilter<"Organization"> | string;
    name?: Prisma.StringFilter<"Organization"> | string;
    slug?: Prisma.StringFilter<"Organization"> | string;
    createdAt?: Prisma.DateTimeFilter<"Organization"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Organization"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    drivers?: Prisma.DriverListRelationFilter;
    vehicles?: Prisma.VehicleListRelationFilter;
    deliveries?: Prisma.DeliveryListRelationFilter;
    routes?: Prisma.RouteListRelationFilter;
    optimizationJobs?: Prisma.OptimizationJobListRelationFilter;
};
export type OrganizationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    users?: Prisma.UserOrderByRelationAggregateInput;
    drivers?: Prisma.DriverOrderByRelationAggregateInput;
    vehicles?: Prisma.VehicleOrderByRelationAggregateInput;
    deliveries?: Prisma.DeliveryOrderByRelationAggregateInput;
    routes?: Prisma.RouteOrderByRelationAggregateInput;
    optimizationJobs?: Prisma.OptimizationJobOrderByRelationAggregateInput;
};
export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    slug?: string;
    AND?: Prisma.OrganizationWhereInput | Prisma.OrganizationWhereInput[];
    OR?: Prisma.OrganizationWhereInput[];
    NOT?: Prisma.OrganizationWhereInput | Prisma.OrganizationWhereInput[];
    name?: Prisma.StringFilter<"Organization"> | string;
    createdAt?: Prisma.DateTimeFilter<"Organization"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Organization"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    drivers?: Prisma.DriverListRelationFilter;
    vehicles?: Prisma.VehicleListRelationFilter;
    deliveries?: Prisma.DeliveryListRelationFilter;
    routes?: Prisma.RouteListRelationFilter;
    optimizationJobs?: Prisma.OptimizationJobListRelationFilter;
}, "id" | "slug">;
export type OrganizationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.OrganizationCountOrderByAggregateInput;
    _max?: Prisma.OrganizationMaxOrderByAggregateInput;
    _min?: Prisma.OrganizationMinOrderByAggregateInput;
};
export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrganizationScalarWhereWithAggregatesInput | Prisma.OrganizationScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrganizationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrganizationScalarWhereWithAggregatesInput | Prisma.OrganizationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Organization"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Organization"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Organization"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Organization"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Organization"> | Date | string;
};
export type OrganizationCreateInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationUncheckedCreateInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverUncheckedCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryUncheckedCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUncheckedUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUncheckedUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationCreateManyInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrganizationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrganizationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrganizationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrganizationScalarRelationFilter = {
    is?: Prisma.OrganizationWhereInput;
    isNot?: Prisma.OrganizationWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type OrganizationCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutUsersInput, Prisma.OrganizationUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutUsersInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutUsersInput, Prisma.OrganizationUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.OrganizationUpsertWithoutUsersInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutUsersInput, Prisma.OrganizationUpdateWithoutUsersInput>, Prisma.OrganizationUncheckedUpdateWithoutUsersInput>;
};
export type OrganizationCreateNestedOneWithoutDriversInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutDriversInput, Prisma.OrganizationUncheckedCreateWithoutDriversInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutDriversInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutDriversNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutDriversInput, Prisma.OrganizationUncheckedCreateWithoutDriversInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutDriversInput;
    upsert?: Prisma.OrganizationUpsertWithoutDriversInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutDriversInput, Prisma.OrganizationUpdateWithoutDriversInput>, Prisma.OrganizationUncheckedUpdateWithoutDriversInput>;
};
export type OrganizationCreateNestedOneWithoutVehiclesInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutVehiclesInput, Prisma.OrganizationUncheckedCreateWithoutVehiclesInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutVehiclesInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutVehiclesNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutVehiclesInput, Prisma.OrganizationUncheckedCreateWithoutVehiclesInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutVehiclesInput;
    upsert?: Prisma.OrganizationUpsertWithoutVehiclesInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutVehiclesInput, Prisma.OrganizationUpdateWithoutVehiclesInput>, Prisma.OrganizationUncheckedUpdateWithoutVehiclesInput>;
};
export type OrganizationCreateNestedOneWithoutDeliveriesInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutDeliveriesInput, Prisma.OrganizationUncheckedCreateWithoutDeliveriesInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutDeliveriesInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutDeliveriesNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutDeliveriesInput, Prisma.OrganizationUncheckedCreateWithoutDeliveriesInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutDeliveriesInput;
    upsert?: Prisma.OrganizationUpsertWithoutDeliveriesInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutDeliveriesInput, Prisma.OrganizationUpdateWithoutDeliveriesInput>, Prisma.OrganizationUncheckedUpdateWithoutDeliveriesInput>;
};
export type OrganizationCreateNestedOneWithoutRoutesInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutRoutesInput, Prisma.OrganizationUncheckedCreateWithoutRoutesInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutRoutesInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutRoutesNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutRoutesInput, Prisma.OrganizationUncheckedCreateWithoutRoutesInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutRoutesInput;
    upsert?: Prisma.OrganizationUpsertWithoutRoutesInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutRoutesInput, Prisma.OrganizationUpdateWithoutRoutesInput>, Prisma.OrganizationUncheckedUpdateWithoutRoutesInput>;
};
export type OrganizationCreateNestedOneWithoutOptimizationJobsInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutOptimizationJobsInput, Prisma.OrganizationUncheckedCreateWithoutOptimizationJobsInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutOptimizationJobsInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutOptimizationJobsNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutOptimizationJobsInput, Prisma.OrganizationUncheckedCreateWithoutOptimizationJobsInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutOptimizationJobsInput;
    upsert?: Prisma.OrganizationUpsertWithoutOptimizationJobsInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutOptimizationJobsInput, Prisma.OrganizationUpdateWithoutOptimizationJobsInput>, Prisma.OrganizationUncheckedUpdateWithoutOptimizationJobsInput>;
};
export type OrganizationCreateWithoutUsersInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    drivers?: Prisma.DriverCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutUsersInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    drivers?: Prisma.DriverUncheckedCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryUncheckedCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutUsersInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutUsersInput, Prisma.OrganizationUncheckedCreateWithoutUsersInput>;
};
export type OrganizationUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutUsersInput, Prisma.OrganizationUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutUsersInput, Prisma.OrganizationUncheckedCreateWithoutUsersInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutUsersInput, Prisma.OrganizationUncheckedUpdateWithoutUsersInput>;
};
export type OrganizationUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    drivers?: Prisma.DriverUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    drivers?: Prisma.DriverUncheckedUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUncheckedUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationCreateWithoutDriversInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutDriversInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryUncheckedCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutDriversInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutDriversInput, Prisma.OrganizationUncheckedCreateWithoutDriversInput>;
};
export type OrganizationUpsertWithoutDriversInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutDriversInput, Prisma.OrganizationUncheckedUpdateWithoutDriversInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutDriversInput, Prisma.OrganizationUncheckedCreateWithoutDriversInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutDriversInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutDriversInput, Prisma.OrganizationUncheckedUpdateWithoutDriversInput>;
};
export type OrganizationUpdateWithoutDriversInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutDriversInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUncheckedUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationCreateWithoutVehiclesInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutVehiclesInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverUncheckedCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryUncheckedCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutVehiclesInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutVehiclesInput, Prisma.OrganizationUncheckedCreateWithoutVehiclesInput>;
};
export type OrganizationUpsertWithoutVehiclesInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutVehiclesInput, Prisma.OrganizationUncheckedUpdateWithoutVehiclesInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutVehiclesInput, Prisma.OrganizationUncheckedCreateWithoutVehiclesInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutVehiclesInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutVehiclesInput, Prisma.OrganizationUncheckedUpdateWithoutVehiclesInput>;
};
export type OrganizationUpdateWithoutVehiclesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutVehiclesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUncheckedUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUncheckedUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationCreateWithoutDeliveriesInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutDeliveriesInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverUncheckedCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutDeliveriesInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutDeliveriesInput, Prisma.OrganizationUncheckedCreateWithoutDeliveriesInput>;
};
export type OrganizationUpsertWithoutDeliveriesInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutDeliveriesInput, Prisma.OrganizationUncheckedUpdateWithoutDeliveriesInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutDeliveriesInput, Prisma.OrganizationUncheckedCreateWithoutDeliveriesInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutDeliveriesInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutDeliveriesInput, Prisma.OrganizationUncheckedUpdateWithoutDeliveriesInput>;
};
export type OrganizationUpdateWithoutDeliveriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutDeliveriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUncheckedUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationCreateWithoutRoutesInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutRoutesInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverUncheckedCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryUncheckedCreateNestedManyWithoutOrganizationInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutRoutesInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutRoutesInput, Prisma.OrganizationUncheckedCreateWithoutRoutesInput>;
};
export type OrganizationUpsertWithoutRoutesInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutRoutesInput, Prisma.OrganizationUncheckedUpdateWithoutRoutesInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutRoutesInput, Prisma.OrganizationUncheckedCreateWithoutRoutesInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutRoutesInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutRoutesInput, Prisma.OrganizationUncheckedUpdateWithoutRoutesInput>;
};
export type OrganizationUpdateWithoutRoutesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutRoutesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUncheckedUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUncheckedUpdateManyWithoutOrganizationNestedInput;
    optimizationJobs?: Prisma.OptimizationJobUncheckedUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationCreateWithoutOptimizationJobsInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutOptimizationJobsInput = {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutOrganizationInput;
    drivers?: Prisma.DriverUncheckedCreateNestedManyWithoutOrganizationInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutOrganizationInput;
    deliveries?: Prisma.DeliveryUncheckedCreateNestedManyWithoutOrganizationInput;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutOptimizationJobsInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutOptimizationJobsInput, Prisma.OrganizationUncheckedCreateWithoutOptimizationJobsInput>;
};
export type OrganizationUpsertWithoutOptimizationJobsInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutOptimizationJobsInput, Prisma.OrganizationUncheckedUpdateWithoutOptimizationJobsInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutOptimizationJobsInput, Prisma.OrganizationUncheckedCreateWithoutOptimizationJobsInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutOptimizationJobsInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutOptimizationJobsInput, Prisma.OrganizationUncheckedUpdateWithoutOptimizationJobsInput>;
};
export type OrganizationUpdateWithoutOptimizationJobsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutOptimizationJobsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutOrganizationNestedInput;
    drivers?: Prisma.DriverUncheckedUpdateManyWithoutOrganizationNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutOrganizationNestedInput;
    deliveries?: Prisma.DeliveryUncheckedUpdateManyWithoutOrganizationNestedInput;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutOrganizationNestedInput;
};
export type OrganizationCountOutputType = {
    users: number;
    drivers: number;
    vehicles: number;
    deliveries: number;
    routes: number;
    optimizationJobs: number;
};
export type OrganizationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | OrganizationCountOutputTypeCountUsersArgs;
    drivers?: boolean | OrganizationCountOutputTypeCountDriversArgs;
    vehicles?: boolean | OrganizationCountOutputTypeCountVehiclesArgs;
    deliveries?: boolean | OrganizationCountOutputTypeCountDeliveriesArgs;
    routes?: boolean | OrganizationCountOutputTypeCountRoutesArgs;
    optimizationJobs?: boolean | OrganizationCountOutputTypeCountOptimizationJobsArgs;
};
export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationCountOutputTypeSelect<ExtArgs> | null;
};
export type OrganizationCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type OrganizationCountOutputTypeCountDriversArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DriverWhereInput;
};
export type OrganizationCountOutputTypeCountVehiclesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleWhereInput;
};
export type OrganizationCountOutputTypeCountDeliveriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeliveryWhereInput;
};
export type OrganizationCountOutputTypeCountRoutesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteWhereInput;
};
export type OrganizationCountOutputTypeCountOptimizationJobsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OptimizationJobWhereInput;
};
export type OrganizationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    users?: boolean | Prisma.Organization$usersArgs<ExtArgs>;
    drivers?: boolean | Prisma.Organization$driversArgs<ExtArgs>;
    vehicles?: boolean | Prisma.Organization$vehiclesArgs<ExtArgs>;
    deliveries?: boolean | Prisma.Organization$deliveriesArgs<ExtArgs>;
    routes?: boolean | Prisma.Organization$routesArgs<ExtArgs>;
    optimizationJobs?: boolean | Prisma.Organization$optimizationJobsArgs<ExtArgs>;
    _count?: boolean | Prisma.OrganizationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["organization"]>;
export type OrganizationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["organization"]>;
export type OrganizationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["organization"]>;
export type OrganizationSelectScalar = {
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type OrganizationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "slug" | "createdAt" | "updatedAt", ExtArgs["result"]["organization"]>;
export type OrganizationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.Organization$usersArgs<ExtArgs>;
    drivers?: boolean | Prisma.Organization$driversArgs<ExtArgs>;
    vehicles?: boolean | Prisma.Organization$vehiclesArgs<ExtArgs>;
    deliveries?: boolean | Prisma.Organization$deliveriesArgs<ExtArgs>;
    routes?: boolean | Prisma.Organization$routesArgs<ExtArgs>;
    optimizationJobs?: boolean | Prisma.Organization$optimizationJobsArgs<ExtArgs>;
    _count?: boolean | Prisma.OrganizationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type OrganizationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $OrganizationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Organization";
    objects: {
        users: Prisma.$UserPayload<ExtArgs>[];
        drivers: Prisma.$DriverPayload<ExtArgs>[];
        vehicles: Prisma.$VehiclePayload<ExtArgs>[];
        deliveries: Prisma.$DeliveryPayload<ExtArgs>[];
        routes: Prisma.$RoutePayload<ExtArgs>[];
        optimizationJobs: Prisma.$OptimizationJobPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["organization"]>;
    composites: {};
};
export type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrganizationPayload, S>;
export type OrganizationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrganizationCountAggregateInputType | true;
};
export interface OrganizationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Organization'];
        meta: {
            name: 'Organization';
        };
    };
    findUnique<T extends OrganizationFindUniqueArgs>(args: Prisma.SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrganizationFindFirstArgs>(args?: Prisma.SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrganizationFindManyArgs>(args?: Prisma.SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrganizationCreateArgs>(args: Prisma.SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrganizationCreateManyArgs>(args?: Prisma.SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrganizationDeleteArgs>(args: Prisma.SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrganizationUpdateArgs>(args: Prisma.SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrganizationUpdateManyArgs>(args: Prisma.SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrganizationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrganizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrganizationUpsertArgs>(args: Prisma.SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrganizationCountArgs>(args?: Prisma.Subset<T, OrganizationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrganizationCountAggregateOutputType> : number>;
    aggregate<T extends OrganizationAggregateArgs>(args: Prisma.Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>;
    groupBy<T extends OrganizationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrganizationGroupByArgs['orderBy'];
    } : {
        orderBy?: OrganizationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrganizationFieldRefs;
}
export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.Organization$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    drivers<T extends Prisma.Organization$driversArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$driversArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    vehicles<T extends Prisma.Organization$vehiclesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$vehiclesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    deliveries<T extends Prisma.Organization$deliveriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$deliveriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    routes<T extends Prisma.Organization$routesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$routesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    optimizationJobs<T extends Prisma.Organization$optimizationJobsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$optimizationJobsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OptimizationJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrganizationFieldRefs {
    readonly id: Prisma.FieldRef<"Organization", 'String'>;
    readonly name: Prisma.FieldRef<"Organization", 'String'>;
    readonly slug: Prisma.FieldRef<"Organization", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Organization", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Organization", 'DateTime'>;
}
export type OrganizationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationScalarFieldEnum | Prisma.OrganizationScalarFieldEnum[];
};
export type OrganizationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationScalarFieldEnum | Prisma.OrganizationScalarFieldEnum[];
};
export type OrganizationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationScalarFieldEnum | Prisma.OrganizationScalarFieldEnum[];
};
export type OrganizationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationCreateInput, Prisma.OrganizationUncheckedCreateInput>;
};
export type OrganizationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrganizationCreateManyInput | Prisma.OrganizationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrganizationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    data: Prisma.OrganizationCreateManyInput | Prisma.OrganizationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrganizationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationUpdateInput, Prisma.OrganizationUncheckedUpdateInput>;
    where: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrganizationUpdateManyMutationInput, Prisma.OrganizationUncheckedUpdateManyInput>;
    where?: Prisma.OrganizationWhereInput;
    limit?: number;
};
export type OrganizationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationUpdateManyMutationInput, Prisma.OrganizationUncheckedUpdateManyInput>;
    where?: Prisma.OrganizationWhereInput;
    limit?: number;
};
export type OrganizationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateInput, Prisma.OrganizationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrganizationUpdateInput, Prisma.OrganizationUncheckedUpdateInput>;
};
export type OrganizationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationWhereInput;
    limit?: number;
};
export type Organization$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type Organization$driversArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    where?: Prisma.DriverWhereInput;
    orderBy?: Prisma.DriverOrderByWithRelationInput | Prisma.DriverOrderByWithRelationInput[];
    cursor?: Prisma.DriverWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DriverScalarFieldEnum | Prisma.DriverScalarFieldEnum[];
};
export type Organization$vehiclesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    include?: Prisma.VehicleInclude<ExtArgs> | null;
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithRelationInput | Prisma.VehicleOrderByWithRelationInput[];
    cursor?: Prisma.VehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehicleScalarFieldEnum | Prisma.VehicleScalarFieldEnum[];
};
export type Organization$deliveriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliverySelect<ExtArgs> | null;
    omit?: Prisma.DeliveryOmit<ExtArgs> | null;
    include?: Prisma.DeliveryInclude<ExtArgs> | null;
    where?: Prisma.DeliveryWhereInput;
    orderBy?: Prisma.DeliveryOrderByWithRelationInput | Prisma.DeliveryOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeliveryScalarFieldEnum | Prisma.DeliveryScalarFieldEnum[];
};
export type Organization$routesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Organization$optimizationJobsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrganizationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
};
