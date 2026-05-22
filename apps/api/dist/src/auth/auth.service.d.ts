import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../generated/prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export type { JwtPayload } from './types/jwt-payload';
export type AuthUserResponse = {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    driverId: string | null;
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
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    getMe(userId: string, organizationId: string): Promise<AuthUserResponse>;
    private buildAuthResponse;
    private toUserResponse;
}
