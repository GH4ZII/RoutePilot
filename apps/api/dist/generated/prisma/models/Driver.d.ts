import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DriverModel = runtime.Types.Result.DefaultSelection<Prisma.$DriverPayload>;
export type AggregateDriver = {
    _count: DriverCountAggregateOutputType | null;
    _min: DriverMinAggregateOutputType | null;
    _max: DriverMaxAggregateOutputType | null;
};
export type DriverMinAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    userId: string | null;
    vehicleId: string | null;
    activeRouteId: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    status: $Enums.DriverStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DriverMaxAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    userId: string | null;
    vehicleId: string | null;
    activeRouteId: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    status: $Enums.DriverStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DriverCountAggregateOutputType = {
    id: number;
    organizationId: number;
    userId: number;
    vehicleId: number;
    activeRouteId: number;
    name: number;
    phone: number;
    email: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DriverMinAggregateInputType = {
    id?: true;
    organizationId?: true;
    userId?: true;
    vehicleId?: true;
    activeRouteId?: true;
    name?: true;
    phone?: true;
    email?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DriverMaxAggregateInputType = {
    id?: true;
    organizationId?: true;
    userId?: true;
    vehicleId?: true;
    activeRouteId?: true;
    name?: true;
    phone?: true;
    email?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DriverCountAggregateInputType = {
    id?: true;
    organizationId?: true;
    userId?: true;
    vehicleId?: true;
    activeRouteId?: true;
    name?: true;
    phone?: true;
    email?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DriverAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DriverWhereInput;
    orderBy?: Prisma.DriverOrderByWithRelationInput | Prisma.DriverOrderByWithRelationInput[];
    cursor?: Prisma.DriverWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DriverCountAggregateInputType;
    _min?: DriverMinAggregateInputType;
    _max?: DriverMaxAggregateInputType;
};
export type GetDriverAggregateType<T extends DriverAggregateArgs> = {
    [P in keyof T & keyof AggregateDriver]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDriver[P]> : Prisma.GetScalarType<T[P], AggregateDriver[P]>;
};
export type DriverGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DriverWhereInput;
    orderBy?: Prisma.DriverOrderByWithAggregationInput | Prisma.DriverOrderByWithAggregationInput[];
    by: Prisma.DriverScalarFieldEnum[] | Prisma.DriverScalarFieldEnum;
    having?: Prisma.DriverScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DriverCountAggregateInputType | true;
    _min?: DriverMinAggregateInputType;
    _max?: DriverMaxAggregateInputType;
};
export type DriverGroupByOutputType = {
    id: string;
    organizationId: string;
    userId: string | null;
    vehicleId: string | null;
    activeRouteId: string | null;
    name: string;
    phone: string | null;
    email: string | null;
    status: $Enums.DriverStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: DriverCountAggregateOutputType | null;
    _min: DriverMinAggregateOutputType | null;
    _max: DriverMaxAggregateOutputType | null;
};
export type GetDriverGroupByPayload<T extends DriverGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DriverGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DriverGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DriverGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DriverGroupByOutputType[P]>;
}>>;
export type DriverWhereInput = {
    AND?: Prisma.DriverWhereInput | Prisma.DriverWhereInput[];
    OR?: Prisma.DriverWhereInput[];
    NOT?: Prisma.DriverWhereInput | Prisma.DriverWhereInput[];
    id?: Prisma.StringFilter<"Driver"> | string;
    organizationId?: Prisma.StringFilter<"Driver"> | string;
    userId?: Prisma.StringNullableFilter<"Driver"> | string | null;
    vehicleId?: Prisma.StringNullableFilter<"Driver"> | string | null;
    activeRouteId?: Prisma.StringNullableFilter<"Driver"> | string | null;
    name?: Prisma.StringFilter<"Driver"> | string;
    phone?: Prisma.StringNullableFilter<"Driver"> | string | null;
    email?: Prisma.StringNullableFilter<"Driver"> | string | null;
    status?: Prisma.EnumDriverStatusFilter<"Driver"> | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFilter<"Driver"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Driver"> | Date | string;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    vehicle?: Prisma.XOR<Prisma.VehicleNullableScalarRelationFilter, Prisma.VehicleWhereInput> | null;
    activeRoute?: Prisma.XOR<Prisma.RouteNullableScalarRelationFilter, Prisma.RouteWhereInput> | null;
    routes?: Prisma.RouteListRelationFilter;
};
export type DriverOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    vehicleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    activeRouteId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    organization?: Prisma.OrganizationOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    vehicle?: Prisma.VehicleOrderByWithRelationInput;
    activeRoute?: Prisma.RouteOrderByWithRelationInput;
    routes?: Prisma.RouteOrderByRelationAggregateInput;
};
export type DriverWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    activeRouteId?: string;
    AND?: Prisma.DriverWhereInput | Prisma.DriverWhereInput[];
    OR?: Prisma.DriverWhereInput[];
    NOT?: Prisma.DriverWhereInput | Prisma.DriverWhereInput[];
    organizationId?: Prisma.StringFilter<"Driver"> | string;
    vehicleId?: Prisma.StringNullableFilter<"Driver"> | string | null;
    name?: Prisma.StringFilter<"Driver"> | string;
    phone?: Prisma.StringNullableFilter<"Driver"> | string | null;
    email?: Prisma.StringNullableFilter<"Driver"> | string | null;
    status?: Prisma.EnumDriverStatusFilter<"Driver"> | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFilter<"Driver"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Driver"> | Date | string;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    vehicle?: Prisma.XOR<Prisma.VehicleNullableScalarRelationFilter, Prisma.VehicleWhereInput> | null;
    activeRoute?: Prisma.XOR<Prisma.RouteNullableScalarRelationFilter, Prisma.RouteWhereInput> | null;
    routes?: Prisma.RouteListRelationFilter;
}, "id" | "userId" | "activeRouteId">;
export type DriverOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    vehicleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    activeRouteId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DriverCountOrderByAggregateInput;
    _max?: Prisma.DriverMaxOrderByAggregateInput;
    _min?: Prisma.DriverMinOrderByAggregateInput;
};
export type DriverScalarWhereWithAggregatesInput = {
    AND?: Prisma.DriverScalarWhereWithAggregatesInput | Prisma.DriverScalarWhereWithAggregatesInput[];
    OR?: Prisma.DriverScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DriverScalarWhereWithAggregatesInput | Prisma.DriverScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Driver"> | string;
    organizationId?: Prisma.StringWithAggregatesFilter<"Driver"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"Driver"> | string | null;
    vehicleId?: Prisma.StringNullableWithAggregatesFilter<"Driver"> | string | null;
    activeRouteId?: Prisma.StringNullableWithAggregatesFilter<"Driver"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"Driver"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Driver"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"Driver"> | string | null;
    status?: Prisma.EnumDriverStatusWithAggregatesFilter<"Driver"> | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Driver"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Driver"> | Date | string;
};
export type DriverCreateInput = {
    id?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutDriversInput;
    user?: Prisma.UserCreateNestedOneWithoutDriverInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutDriversInput;
    activeRoute?: Prisma.RouteCreateNestedOneWithoutActiveDriverInput;
    routes?: Prisma.RouteCreateNestedManyWithoutDriverInput;
};
export type DriverUncheckedCreateInput = {
    id?: string;
    organizationId: string;
    userId?: string | null;
    vehicleId?: string | null;
    activeRouteId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutDriverInput;
};
export type DriverUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutDriversNestedInput;
    user?: Prisma.UserUpdateOneWithoutDriverNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutDriversNestedInput;
    activeRoute?: Prisma.RouteUpdateOneWithoutActiveDriverNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutDriverNestedInput;
};
export type DriverUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeRouteId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutDriverNestedInput;
};
export type DriverCreateManyInput = {
    id?: string;
    organizationId: string;
    userId?: string | null;
    vehicleId?: string | null;
    activeRouteId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DriverUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DriverUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeRouteId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DriverListRelationFilter = {
    every?: Prisma.DriverWhereInput;
    some?: Prisma.DriverWhereInput;
    none?: Prisma.DriverWhereInput;
};
export type DriverOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DriverNullableScalarRelationFilter = {
    is?: Prisma.DriverWhereInput | null;
    isNot?: Prisma.DriverWhereInput | null;
};
export type DriverCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    activeRouteId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DriverMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    activeRouteId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DriverMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    activeRouteId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DriverCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutOrganizationInput, Prisma.DriverUncheckedCreateWithoutOrganizationInput> | Prisma.DriverCreateWithoutOrganizationInput[] | Prisma.DriverUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutOrganizationInput | Prisma.DriverCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.DriverCreateManyOrganizationInputEnvelope;
    connect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
};
export type DriverUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutOrganizationInput, Prisma.DriverUncheckedCreateWithoutOrganizationInput> | Prisma.DriverCreateWithoutOrganizationInput[] | Prisma.DriverUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutOrganizationInput | Prisma.DriverCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.DriverCreateManyOrganizationInputEnvelope;
    connect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
};
export type DriverUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutOrganizationInput, Prisma.DriverUncheckedCreateWithoutOrganizationInput> | Prisma.DriverCreateWithoutOrganizationInput[] | Prisma.DriverUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutOrganizationInput | Prisma.DriverCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.DriverUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.DriverUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.DriverCreateManyOrganizationInputEnvelope;
    set?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    disconnect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    delete?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    connect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    update?: Prisma.DriverUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.DriverUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.DriverUpdateManyWithWhereWithoutOrganizationInput | Prisma.DriverUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.DriverScalarWhereInput | Prisma.DriverScalarWhereInput[];
};
export type DriverUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutOrganizationInput, Prisma.DriverUncheckedCreateWithoutOrganizationInput> | Prisma.DriverCreateWithoutOrganizationInput[] | Prisma.DriverUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutOrganizationInput | Prisma.DriverCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.DriverUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.DriverUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.DriverCreateManyOrganizationInputEnvelope;
    set?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    disconnect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    delete?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    connect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    update?: Prisma.DriverUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.DriverUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.DriverUpdateManyWithWhereWithoutOrganizationInput | Prisma.DriverUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.DriverScalarWhereInput | Prisma.DriverScalarWhereInput[];
};
export type DriverCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutUserInput, Prisma.DriverUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutUserInput;
    connect?: Prisma.DriverWhereUniqueInput;
};
export type DriverUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutUserInput, Prisma.DriverUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutUserInput;
    connect?: Prisma.DriverWhereUniqueInput;
};
export type DriverUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutUserInput, Prisma.DriverUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutUserInput;
    upsert?: Prisma.DriverUpsertWithoutUserInput;
    disconnect?: Prisma.DriverWhereInput | boolean;
    delete?: Prisma.DriverWhereInput | boolean;
    connect?: Prisma.DriverWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DriverUpdateToOneWithWhereWithoutUserInput, Prisma.DriverUpdateWithoutUserInput>, Prisma.DriverUncheckedUpdateWithoutUserInput>;
};
export type DriverUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutUserInput, Prisma.DriverUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutUserInput;
    upsert?: Prisma.DriverUpsertWithoutUserInput;
    disconnect?: Prisma.DriverWhereInput | boolean;
    delete?: Prisma.DriverWhereInput | boolean;
    connect?: Prisma.DriverWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DriverUpdateToOneWithWhereWithoutUserInput, Prisma.DriverUpdateWithoutUserInput>, Prisma.DriverUncheckedUpdateWithoutUserInput>;
};
export type EnumDriverStatusFieldUpdateOperationsInput = {
    set?: $Enums.DriverStatus;
};
export type DriverCreateNestedManyWithoutVehicleInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutVehicleInput, Prisma.DriverUncheckedCreateWithoutVehicleInput> | Prisma.DriverCreateWithoutVehicleInput[] | Prisma.DriverUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutVehicleInput | Prisma.DriverCreateOrConnectWithoutVehicleInput[];
    createMany?: Prisma.DriverCreateManyVehicleInputEnvelope;
    connect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
};
export type DriverUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutVehicleInput, Prisma.DriverUncheckedCreateWithoutVehicleInput> | Prisma.DriverCreateWithoutVehicleInput[] | Prisma.DriverUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutVehicleInput | Prisma.DriverCreateOrConnectWithoutVehicleInput[];
    createMany?: Prisma.DriverCreateManyVehicleInputEnvelope;
    connect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
};
export type DriverUpdateManyWithoutVehicleNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutVehicleInput, Prisma.DriverUncheckedCreateWithoutVehicleInput> | Prisma.DriverCreateWithoutVehicleInput[] | Prisma.DriverUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutVehicleInput | Prisma.DriverCreateOrConnectWithoutVehicleInput[];
    upsert?: Prisma.DriverUpsertWithWhereUniqueWithoutVehicleInput | Prisma.DriverUpsertWithWhereUniqueWithoutVehicleInput[];
    createMany?: Prisma.DriverCreateManyVehicleInputEnvelope;
    set?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    disconnect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    delete?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    connect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    update?: Prisma.DriverUpdateWithWhereUniqueWithoutVehicleInput | Prisma.DriverUpdateWithWhereUniqueWithoutVehicleInput[];
    updateMany?: Prisma.DriverUpdateManyWithWhereWithoutVehicleInput | Prisma.DriverUpdateManyWithWhereWithoutVehicleInput[];
    deleteMany?: Prisma.DriverScalarWhereInput | Prisma.DriverScalarWhereInput[];
};
export type DriverUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutVehicleInput, Prisma.DriverUncheckedCreateWithoutVehicleInput> | Prisma.DriverCreateWithoutVehicleInput[] | Prisma.DriverUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutVehicleInput | Prisma.DriverCreateOrConnectWithoutVehicleInput[];
    upsert?: Prisma.DriverUpsertWithWhereUniqueWithoutVehicleInput | Prisma.DriverUpsertWithWhereUniqueWithoutVehicleInput[];
    createMany?: Prisma.DriverCreateManyVehicleInputEnvelope;
    set?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    disconnect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    delete?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    connect?: Prisma.DriverWhereUniqueInput | Prisma.DriverWhereUniqueInput[];
    update?: Prisma.DriverUpdateWithWhereUniqueWithoutVehicleInput | Prisma.DriverUpdateWithWhereUniqueWithoutVehicleInput[];
    updateMany?: Prisma.DriverUpdateManyWithWhereWithoutVehicleInput | Prisma.DriverUpdateManyWithWhereWithoutVehicleInput[];
    deleteMany?: Prisma.DriverScalarWhereInput | Prisma.DriverScalarWhereInput[];
};
export type DriverCreateNestedOneWithoutRoutesInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutRoutesInput, Prisma.DriverUncheckedCreateWithoutRoutesInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutRoutesInput;
    connect?: Prisma.DriverWhereUniqueInput;
};
export type DriverCreateNestedOneWithoutActiveRouteInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutActiveRouteInput, Prisma.DriverUncheckedCreateWithoutActiveRouteInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutActiveRouteInput;
    connect?: Prisma.DriverWhereUniqueInput;
};
export type DriverUncheckedCreateNestedOneWithoutActiveRouteInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutActiveRouteInput, Prisma.DriverUncheckedCreateWithoutActiveRouteInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutActiveRouteInput;
    connect?: Prisma.DriverWhereUniqueInput;
};
export type DriverUpdateOneWithoutRoutesNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutRoutesInput, Prisma.DriverUncheckedCreateWithoutRoutesInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutRoutesInput;
    upsert?: Prisma.DriverUpsertWithoutRoutesInput;
    disconnect?: Prisma.DriverWhereInput | boolean;
    delete?: Prisma.DriverWhereInput | boolean;
    connect?: Prisma.DriverWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DriverUpdateToOneWithWhereWithoutRoutesInput, Prisma.DriverUpdateWithoutRoutesInput>, Prisma.DriverUncheckedUpdateWithoutRoutesInput>;
};
export type DriverUpdateOneWithoutActiveRouteNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutActiveRouteInput, Prisma.DriverUncheckedCreateWithoutActiveRouteInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutActiveRouteInput;
    upsert?: Prisma.DriverUpsertWithoutActiveRouteInput;
    disconnect?: Prisma.DriverWhereInput | boolean;
    delete?: Prisma.DriverWhereInput | boolean;
    connect?: Prisma.DriverWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DriverUpdateToOneWithWhereWithoutActiveRouteInput, Prisma.DriverUpdateWithoutActiveRouteInput>, Prisma.DriverUncheckedUpdateWithoutActiveRouteInput>;
};
export type DriverUncheckedUpdateOneWithoutActiveRouteNestedInput = {
    create?: Prisma.XOR<Prisma.DriverCreateWithoutActiveRouteInput, Prisma.DriverUncheckedCreateWithoutActiveRouteInput>;
    connectOrCreate?: Prisma.DriverCreateOrConnectWithoutActiveRouteInput;
    upsert?: Prisma.DriverUpsertWithoutActiveRouteInput;
    disconnect?: Prisma.DriverWhereInput | boolean;
    delete?: Prisma.DriverWhereInput | boolean;
    connect?: Prisma.DriverWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DriverUpdateToOneWithWhereWithoutActiveRouteInput, Prisma.DriverUpdateWithoutActiveRouteInput>, Prisma.DriverUncheckedUpdateWithoutActiveRouteInput>;
};
export type DriverCreateWithoutOrganizationInput = {
    id?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutDriverInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutDriversInput;
    activeRoute?: Prisma.RouteCreateNestedOneWithoutActiveDriverInput;
    routes?: Prisma.RouteCreateNestedManyWithoutDriverInput;
};
export type DriverUncheckedCreateWithoutOrganizationInput = {
    id?: string;
    userId?: string | null;
    vehicleId?: string | null;
    activeRouteId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutDriverInput;
};
export type DriverCreateOrConnectWithoutOrganizationInput = {
    where: Prisma.DriverWhereUniqueInput;
    create: Prisma.XOR<Prisma.DriverCreateWithoutOrganizationInput, Prisma.DriverUncheckedCreateWithoutOrganizationInput>;
};
export type DriverCreateManyOrganizationInputEnvelope = {
    data: Prisma.DriverCreateManyOrganizationInput | Prisma.DriverCreateManyOrganizationInput[];
    skipDuplicates?: boolean;
};
export type DriverUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.DriverWhereUniqueInput;
    update: Prisma.XOR<Prisma.DriverUpdateWithoutOrganizationInput, Prisma.DriverUncheckedUpdateWithoutOrganizationInput>;
    create: Prisma.XOR<Prisma.DriverCreateWithoutOrganizationInput, Prisma.DriverUncheckedCreateWithoutOrganizationInput>;
};
export type DriverUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.DriverWhereUniqueInput;
    data: Prisma.XOR<Prisma.DriverUpdateWithoutOrganizationInput, Prisma.DriverUncheckedUpdateWithoutOrganizationInput>;
};
export type DriverUpdateManyWithWhereWithoutOrganizationInput = {
    where: Prisma.DriverScalarWhereInput;
    data: Prisma.XOR<Prisma.DriverUpdateManyMutationInput, Prisma.DriverUncheckedUpdateManyWithoutOrganizationInput>;
};
export type DriverScalarWhereInput = {
    AND?: Prisma.DriverScalarWhereInput | Prisma.DriverScalarWhereInput[];
    OR?: Prisma.DriverScalarWhereInput[];
    NOT?: Prisma.DriverScalarWhereInput | Prisma.DriverScalarWhereInput[];
    id?: Prisma.StringFilter<"Driver"> | string;
    organizationId?: Prisma.StringFilter<"Driver"> | string;
    userId?: Prisma.StringNullableFilter<"Driver"> | string | null;
    vehicleId?: Prisma.StringNullableFilter<"Driver"> | string | null;
    activeRouteId?: Prisma.StringNullableFilter<"Driver"> | string | null;
    name?: Prisma.StringFilter<"Driver"> | string;
    phone?: Prisma.StringNullableFilter<"Driver"> | string | null;
    email?: Prisma.StringNullableFilter<"Driver"> | string | null;
    status?: Prisma.EnumDriverStatusFilter<"Driver"> | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFilter<"Driver"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Driver"> | Date | string;
};
export type DriverCreateWithoutUserInput = {
    id?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutDriversInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutDriversInput;
    activeRoute?: Prisma.RouteCreateNestedOneWithoutActiveDriverInput;
    routes?: Prisma.RouteCreateNestedManyWithoutDriverInput;
};
export type DriverUncheckedCreateWithoutUserInput = {
    id?: string;
    organizationId: string;
    vehicleId?: string | null;
    activeRouteId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutDriverInput;
};
export type DriverCreateOrConnectWithoutUserInput = {
    where: Prisma.DriverWhereUniqueInput;
    create: Prisma.XOR<Prisma.DriverCreateWithoutUserInput, Prisma.DriverUncheckedCreateWithoutUserInput>;
};
export type DriverUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.DriverUpdateWithoutUserInput, Prisma.DriverUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.DriverCreateWithoutUserInput, Prisma.DriverUncheckedCreateWithoutUserInput>;
    where?: Prisma.DriverWhereInput;
};
export type DriverUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.DriverWhereInput;
    data: Prisma.XOR<Prisma.DriverUpdateWithoutUserInput, Prisma.DriverUncheckedUpdateWithoutUserInput>;
};
export type DriverUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutDriversNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutDriversNestedInput;
    activeRoute?: Prisma.RouteUpdateOneWithoutActiveDriverNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutDriverNestedInput;
};
export type DriverUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeRouteId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutDriverNestedInput;
};
export type DriverCreateWithoutVehicleInput = {
    id?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutDriversInput;
    user?: Prisma.UserCreateNestedOneWithoutDriverInput;
    activeRoute?: Prisma.RouteCreateNestedOneWithoutActiveDriverInput;
    routes?: Prisma.RouteCreateNestedManyWithoutDriverInput;
};
export type DriverUncheckedCreateWithoutVehicleInput = {
    id?: string;
    organizationId: string;
    userId?: string | null;
    activeRouteId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutDriverInput;
};
export type DriverCreateOrConnectWithoutVehicleInput = {
    where: Prisma.DriverWhereUniqueInput;
    create: Prisma.XOR<Prisma.DriverCreateWithoutVehicleInput, Prisma.DriverUncheckedCreateWithoutVehicleInput>;
};
export type DriverCreateManyVehicleInputEnvelope = {
    data: Prisma.DriverCreateManyVehicleInput | Prisma.DriverCreateManyVehicleInput[];
    skipDuplicates?: boolean;
};
export type DriverUpsertWithWhereUniqueWithoutVehicleInput = {
    where: Prisma.DriverWhereUniqueInput;
    update: Prisma.XOR<Prisma.DriverUpdateWithoutVehicleInput, Prisma.DriverUncheckedUpdateWithoutVehicleInput>;
    create: Prisma.XOR<Prisma.DriverCreateWithoutVehicleInput, Prisma.DriverUncheckedCreateWithoutVehicleInput>;
};
export type DriverUpdateWithWhereUniqueWithoutVehicleInput = {
    where: Prisma.DriverWhereUniqueInput;
    data: Prisma.XOR<Prisma.DriverUpdateWithoutVehicleInput, Prisma.DriverUncheckedUpdateWithoutVehicleInput>;
};
export type DriverUpdateManyWithWhereWithoutVehicleInput = {
    where: Prisma.DriverScalarWhereInput;
    data: Prisma.XOR<Prisma.DriverUpdateManyMutationInput, Prisma.DriverUncheckedUpdateManyWithoutVehicleInput>;
};
export type DriverCreateWithoutRoutesInput = {
    id?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutDriversInput;
    user?: Prisma.UserCreateNestedOneWithoutDriverInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutDriversInput;
    activeRoute?: Prisma.RouteCreateNestedOneWithoutActiveDriverInput;
};
export type DriverUncheckedCreateWithoutRoutesInput = {
    id?: string;
    organizationId: string;
    userId?: string | null;
    vehicleId?: string | null;
    activeRouteId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DriverCreateOrConnectWithoutRoutesInput = {
    where: Prisma.DriverWhereUniqueInput;
    create: Prisma.XOR<Prisma.DriverCreateWithoutRoutesInput, Prisma.DriverUncheckedCreateWithoutRoutesInput>;
};
export type DriverCreateWithoutActiveRouteInput = {
    id?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutDriversInput;
    user?: Prisma.UserCreateNestedOneWithoutDriverInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutDriversInput;
    routes?: Prisma.RouteCreateNestedManyWithoutDriverInput;
};
export type DriverUncheckedCreateWithoutActiveRouteInput = {
    id?: string;
    organizationId: string;
    userId?: string | null;
    vehicleId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    routes?: Prisma.RouteUncheckedCreateNestedManyWithoutDriverInput;
};
export type DriverCreateOrConnectWithoutActiveRouteInput = {
    where: Prisma.DriverWhereUniqueInput;
    create: Prisma.XOR<Prisma.DriverCreateWithoutActiveRouteInput, Prisma.DriverUncheckedCreateWithoutActiveRouteInput>;
};
export type DriverUpsertWithoutRoutesInput = {
    update: Prisma.XOR<Prisma.DriverUpdateWithoutRoutesInput, Prisma.DriverUncheckedUpdateWithoutRoutesInput>;
    create: Prisma.XOR<Prisma.DriverCreateWithoutRoutesInput, Prisma.DriverUncheckedCreateWithoutRoutesInput>;
    where?: Prisma.DriverWhereInput;
};
export type DriverUpdateToOneWithWhereWithoutRoutesInput = {
    where?: Prisma.DriverWhereInput;
    data: Prisma.XOR<Prisma.DriverUpdateWithoutRoutesInput, Prisma.DriverUncheckedUpdateWithoutRoutesInput>;
};
export type DriverUpdateWithoutRoutesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutDriversNestedInput;
    user?: Prisma.UserUpdateOneWithoutDriverNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutDriversNestedInput;
    activeRoute?: Prisma.RouteUpdateOneWithoutActiveDriverNestedInput;
};
export type DriverUncheckedUpdateWithoutRoutesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeRouteId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DriverUpsertWithoutActiveRouteInput = {
    update: Prisma.XOR<Prisma.DriverUpdateWithoutActiveRouteInput, Prisma.DriverUncheckedUpdateWithoutActiveRouteInput>;
    create: Prisma.XOR<Prisma.DriverCreateWithoutActiveRouteInput, Prisma.DriverUncheckedCreateWithoutActiveRouteInput>;
    where?: Prisma.DriverWhereInput;
};
export type DriverUpdateToOneWithWhereWithoutActiveRouteInput = {
    where?: Prisma.DriverWhereInput;
    data: Prisma.XOR<Prisma.DriverUpdateWithoutActiveRouteInput, Prisma.DriverUncheckedUpdateWithoutActiveRouteInput>;
};
export type DriverUpdateWithoutActiveRouteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutDriversNestedInput;
    user?: Prisma.UserUpdateOneWithoutDriverNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutDriversNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutDriverNestedInput;
};
export type DriverUncheckedUpdateWithoutActiveRouteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutDriverNestedInput;
};
export type DriverCreateManyOrganizationInput = {
    id?: string;
    userId?: string | null;
    vehicleId?: string | null;
    activeRouteId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DriverUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutDriverNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutDriversNestedInput;
    activeRoute?: Prisma.RouteUpdateOneWithoutActiveDriverNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutDriverNestedInput;
};
export type DriverUncheckedUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeRouteId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutDriverNestedInput;
};
export type DriverUncheckedUpdateManyWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeRouteId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DriverCreateManyVehicleInput = {
    id?: string;
    organizationId: string;
    userId?: string | null;
    activeRouteId?: string | null;
    name: string;
    phone?: string | null;
    email?: string | null;
    status?: $Enums.DriverStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DriverUpdateWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutDriversNestedInput;
    user?: Prisma.UserUpdateOneWithoutDriverNestedInput;
    activeRoute?: Prisma.RouteUpdateOneWithoutActiveDriverNestedInput;
    routes?: Prisma.RouteUpdateManyWithoutDriverNestedInput;
};
export type DriverUncheckedUpdateWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeRouteId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    routes?: Prisma.RouteUncheckedUpdateManyWithoutDriverNestedInput;
};
export type DriverUncheckedUpdateManyWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeRouteId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumDriverStatusFieldUpdateOperationsInput | $Enums.DriverStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DriverCountOutputType = {
    routes: number;
};
export type DriverCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    routes?: boolean | DriverCountOutputTypeCountRoutesArgs;
};
export type DriverCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverCountOutputTypeSelect<ExtArgs> | null;
};
export type DriverCountOutputTypeCountRoutesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RouteWhereInput;
};
export type DriverSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    userId?: boolean;
    vehicleId?: boolean;
    activeRouteId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.Driver$userArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Driver$vehicleArgs<ExtArgs>;
    activeRoute?: boolean | Prisma.Driver$activeRouteArgs<ExtArgs>;
    routes?: boolean | Prisma.Driver$routesArgs<ExtArgs>;
    _count?: boolean | Prisma.DriverCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["driver"]>;
export type DriverSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    userId?: boolean;
    vehicleId?: boolean;
    activeRouteId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.Driver$userArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Driver$vehicleArgs<ExtArgs>;
    activeRoute?: boolean | Prisma.Driver$activeRouteArgs<ExtArgs>;
}, ExtArgs["result"]["driver"]>;
export type DriverSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    userId?: boolean;
    vehicleId?: boolean;
    activeRouteId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.Driver$userArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Driver$vehicleArgs<ExtArgs>;
    activeRoute?: boolean | Prisma.Driver$activeRouteArgs<ExtArgs>;
}, ExtArgs["result"]["driver"]>;
export type DriverSelectScalar = {
    id?: boolean;
    organizationId?: boolean;
    userId?: boolean;
    vehicleId?: boolean;
    activeRouteId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DriverOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "organizationId" | "userId" | "vehicleId" | "activeRouteId" | "name" | "phone" | "email" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["driver"]>;
export type DriverInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.Driver$userArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Driver$vehicleArgs<ExtArgs>;
    activeRoute?: boolean | Prisma.Driver$activeRouteArgs<ExtArgs>;
    routes?: boolean | Prisma.Driver$routesArgs<ExtArgs>;
    _count?: boolean | Prisma.DriverCountOutputTypeDefaultArgs<ExtArgs>;
};
export type DriverIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.Driver$userArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Driver$vehicleArgs<ExtArgs>;
    activeRoute?: boolean | Prisma.Driver$activeRouteArgs<ExtArgs>;
};
export type DriverIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.Driver$userArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Driver$vehicleArgs<ExtArgs>;
    activeRoute?: boolean | Prisma.Driver$activeRouteArgs<ExtArgs>;
};
export type $DriverPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Driver";
    objects: {
        organization: Prisma.$OrganizationPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs> | null;
        vehicle: Prisma.$VehiclePayload<ExtArgs> | null;
        activeRoute: Prisma.$RoutePayload<ExtArgs> | null;
        routes: Prisma.$RoutePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        organizationId: string;
        userId: string | null;
        vehicleId: string | null;
        activeRouteId: string | null;
        name: string;
        phone: string | null;
        email: string | null;
        status: $Enums.DriverStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["driver"]>;
    composites: {};
};
export type DriverGetPayload<S extends boolean | null | undefined | DriverDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DriverPayload, S>;
export type DriverCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DriverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DriverCountAggregateInputType | true;
};
export interface DriverDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Driver'];
        meta: {
            name: 'Driver';
        };
    };
    findUnique<T extends DriverFindUniqueArgs>(args: Prisma.SelectSubset<T, DriverFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DriverFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DriverFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DriverFindFirstArgs>(args?: Prisma.SelectSubset<T, DriverFindFirstArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DriverFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DriverFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DriverFindManyArgs>(args?: Prisma.SelectSubset<T, DriverFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DriverCreateArgs>(args: Prisma.SelectSubset<T, DriverCreateArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DriverCreateManyArgs>(args?: Prisma.SelectSubset<T, DriverCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DriverCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DriverCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DriverDeleteArgs>(args: Prisma.SelectSubset<T, DriverDeleteArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DriverUpdateArgs>(args: Prisma.SelectSubset<T, DriverUpdateArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DriverDeleteManyArgs>(args?: Prisma.SelectSubset<T, DriverDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DriverUpdateManyArgs>(args: Prisma.SelectSubset<T, DriverUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DriverUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DriverUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DriverUpsertArgs>(args: Prisma.SelectSubset<T, DriverUpsertArgs<ExtArgs>>): Prisma.Prisma__DriverClient<runtime.Types.Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DriverCountArgs>(args?: Prisma.Subset<T, DriverCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DriverCountAggregateOutputType> : number>;
    aggregate<T extends DriverAggregateArgs>(args: Prisma.Subset<T, DriverAggregateArgs>): Prisma.PrismaPromise<GetDriverAggregateType<T>>;
    groupBy<T extends DriverGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DriverGroupByArgs['orderBy'];
    } : {
        orderBy?: DriverGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DriverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDriverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DriverFieldRefs;
}
export interface Prisma__DriverClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    organization<T extends Prisma.OrganizationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationDefaultArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.Driver$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Driver$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    vehicle<T extends Prisma.Driver$vehicleArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Driver$vehicleArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    activeRoute<T extends Prisma.Driver$activeRouteArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Driver$activeRouteArgs<ExtArgs>>): Prisma.Prisma__RouteClient<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    routes<T extends Prisma.Driver$routesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Driver$routesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoutePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DriverFieldRefs {
    readonly id: Prisma.FieldRef<"Driver", 'String'>;
    readonly organizationId: Prisma.FieldRef<"Driver", 'String'>;
    readonly userId: Prisma.FieldRef<"Driver", 'String'>;
    readonly vehicleId: Prisma.FieldRef<"Driver", 'String'>;
    readonly activeRouteId: Prisma.FieldRef<"Driver", 'String'>;
    readonly name: Prisma.FieldRef<"Driver", 'String'>;
    readonly phone: Prisma.FieldRef<"Driver", 'String'>;
    readonly email: Prisma.FieldRef<"Driver", 'String'>;
    readonly status: Prisma.FieldRef<"Driver", 'DriverStatus'>;
    readonly createdAt: Prisma.FieldRef<"Driver", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Driver", 'DateTime'>;
}
export type DriverFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    where: Prisma.DriverWhereUniqueInput;
};
export type DriverFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    where: Prisma.DriverWhereUniqueInput;
};
export type DriverFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DriverFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DriverFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DriverCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DriverCreateInput, Prisma.DriverUncheckedCreateInput>;
};
export type DriverCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DriverCreateManyInput | Prisma.DriverCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DriverCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    data: Prisma.DriverCreateManyInput | Prisma.DriverCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DriverIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DriverUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DriverUpdateInput, Prisma.DriverUncheckedUpdateInput>;
    where: Prisma.DriverWhereUniqueInput;
};
export type DriverUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DriverUpdateManyMutationInput, Prisma.DriverUncheckedUpdateManyInput>;
    where?: Prisma.DriverWhereInput;
    limit?: number;
};
export type DriverUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DriverUpdateManyMutationInput, Prisma.DriverUncheckedUpdateManyInput>;
    where?: Prisma.DriverWhereInput;
    limit?: number;
    include?: Prisma.DriverIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DriverUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    where: Prisma.DriverWhereUniqueInput;
    create: Prisma.XOR<Prisma.DriverCreateInput, Prisma.DriverUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DriverUpdateInput, Prisma.DriverUncheckedUpdateInput>;
};
export type DriverDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
    where: Prisma.DriverWhereUniqueInput;
};
export type DriverDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DriverWhereInput;
    limit?: number;
};
export type Driver$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Driver$vehicleArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    include?: Prisma.VehicleInclude<ExtArgs> | null;
    where?: Prisma.VehicleWhereInput;
};
export type Driver$activeRouteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RouteSelect<ExtArgs> | null;
    omit?: Prisma.RouteOmit<ExtArgs> | null;
    include?: Prisma.RouteInclude<ExtArgs> | null;
    where?: Prisma.RouteWhereInput;
};
export type Driver$routesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DriverDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriverSelect<ExtArgs> | null;
    omit?: Prisma.DriverOmit<ExtArgs> | null;
    include?: Prisma.DriverInclude<ExtArgs> | null;
};
