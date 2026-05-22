import { UserRole } from '../../generated/prisma/client';
export declare class UpdateUserDto {
    password?: string;
    role?: UserRole;
    name?: string;
}
