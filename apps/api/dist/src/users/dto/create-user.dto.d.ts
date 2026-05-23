import { UserRole } from '../../generated/prisma/client';
export declare class CreateUserDto {
    email: string;
    password: string;
    role: UserRole;
    name?: string;
    avatarUrl?: string;
}
