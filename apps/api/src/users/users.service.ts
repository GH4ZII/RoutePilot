import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
  ) {}

  async findAll(user: JwtPayload): Promise<UserResponse[]> {
    const rows = await this.prisma.user.findMany({
      where: this.orgScope.forOrganization(user),
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toUserResponse);
  }

  async findOne(user: JwtPayload, id: string): Promise<UserResponse> {
    const row = await this.findScopedOrThrow(user, id);
    return toUserResponse(row);
  }

  async create(user: JwtPayload, dto: CreateUserDto): Promise<UserResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { organizationId_email: { organizationId, email } },
    });
    if (existing) {
      throw new ConflictException('Email already in use in this organization');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const created = await this.prisma.user.create({
      data: {
        organizationId,
        email,
        passwordHash,
        role: dto.role,
        name: dto.name,
        avatarUrl: dto.avatarUrl,
      },
    });
    return toUserResponse(created);
  }

  async update(
    user: JwtPayload,
    id: string,
    dto: UpdateUserDto,
  ): Promise<UserResponse> {
    await this.findScopedOrThrow(user, id);

    const data: {
      role?: UserRole;
      name?: string;
      avatarUrl?: string | null;
      passwordHash?: string;
    } = {};

    if (dto.role !== undefined) {
      data.role = dto.role;
    }
    if (dto.name !== undefined) {
      data.name = dto.name;
    }
    if (dto.avatarUrl !== undefined) {
      data.avatarUrl = dto.avatarUrl;
    }
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 12);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    return toUserResponse(updated);
  }

  async remove(user: JwtPayload, id: string): Promise<void> {
    if (user.sub === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    await this.findScopedOrThrow(user, id);
    await this.prisma.user.delete({ where: { id } });
  }

  private async findScopedOrThrow(user: JwtPayload, id: string) {
    const row = await this.prisma.user.findFirst({
      where: this.orgScope.forOrganization(user, { id }),
    });
    if (!row) {
      throw new NotFoundException('User not found');
    }
    return row;
  }
}

function toUserResponse(user: {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): UserResponse {
  return {
    id: user.id,
    organizationId: user.organizationId,
    email: user.email,
    role: user.role,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
