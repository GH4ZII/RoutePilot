import {
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import type { StringValue } from 'ms';
  import { PrismaService } from '../prisma/prisma.service';
  import { UserRole } from '../generated/prisma/client';
  import { LoginDto } from './dto/login.dto';
  import { RegisterDto } from './dto/register.dto';
  import type { JwtPayload } from './types/jwt-payload';

  export type { JwtPayload } from './types/jwt-payload';
  
  export type AuthUserResponse = {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  };
  
  export type AuthResponse = {
    accessToken: string;
    user: AuthUserResponse;
  };
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly jwt: JwtService,
      private readonly config: ConfigService,
    ) {}
  
    async register(dto: RegisterDto): Promise<AuthResponse> {
      const email = dto.email.toLowerCase();
      const slug = dto.organizationSlug.toLowerCase();
  
      const existingOrg = await this.prisma.organization.findUnique({
        where: { slug },
      });
      if (existingOrg) {
        throw new ConflictException('Organization slug already in use');
      }
  
      const passwordHash = await bcrypt.hash(dto.password, 12);
  
      const result = await this.prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: {
            name: dto.organizationName,
            slug,
          },
        });
  
        const user = await tx.user.create({
          data: {
            organizationId: organization.id,
            email,
            passwordHash,
            role: UserRole.ADMIN,
            name: dto.name,
          },
        });
  
        return { organization, user };
      });
  
      return this.buildAuthResponse(result.user, result.organization);
    }
  
    async login(dto: LoginDto): Promise<AuthResponse> {
      const email = dto.email.toLowerCase();
      const slug = dto.organizationSlug.toLowerCase();
  
      const organization = await this.prisma.organization.findUnique({
        where: { slug },
      });
      if (!organization) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const user = await this.prisma.user.findUnique({
        where: {
          organizationId_email: {
            organizationId: organization.id,
            email,
          },
        },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const valid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!valid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      return this.buildAuthResponse(user, organization);
    }
  
    async getMe(userId: string, organizationId: string): Promise<AuthUserResponse> {
      const user = await this.prisma.user.findFirst({
        where: { id: userId, organizationId },
        include: { organization: true },
      });
      if (!user) {
        throw new UnauthorizedException();
      }
  
      return this.toUserResponse(user, user.organization);
    }
  
    private buildAuthResponse(
      user: {
        id: string;
        email: string;
        name: string | null;
        role: UserRole;
        organizationId: string;
      },
      organization: { id: string; name: string; slug: string },
    ): AuthResponse {
      const payload: JwtPayload = {
        sub: user.id,
        organizationId: user.organizationId,
        role: user.role,
      };
  
      const accessToken = this.jwt.sign(payload, {
        expiresIn: (this.config.get<string>('JWT_EXPIRES_IN') ??
          '7d') as StringValue,
      });
  
      return {
        accessToken,
        user: this.toUserResponse(user, organization),
      };
    }
  
    private toUserResponse(
      user: {
        id: string;
        email: string;
        name: string | null;
        role: UserRole;
      },
      organization: { id: string; name: string; slug: string },
    ): AuthUserResponse {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        },
      };
    }
  }