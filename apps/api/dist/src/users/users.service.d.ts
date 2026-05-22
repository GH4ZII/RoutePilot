import { UserRole } from '../generated/prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export type UserResponse = {
    id: string;
    organizationId: string;
    email: string;
    role: UserRole;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
};
export declare class UsersService {
    private readonly prisma;
    private readonly orgScope;
    constructor(prisma: PrismaService, orgScope: OrgScopeService);
    findAll(user: JwtPayload): Promise<UserResponse[]>;
    findOne(user: JwtPayload, id: string): Promise<UserResponse>;
    create(user: JwtPayload, dto: CreateUserDto): Promise<UserResponse>;
    update(user: JwtPayload, id: string, dto: UpdateUserDto): Promise<UserResponse>;
    remove(user: JwtPayload, id: string): Promise<void>;
    private findScopedOrThrow;
}
