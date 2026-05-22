import type { UserRole } from '../../generated/prisma/client';
export type JwtPayload = {
    sub: string;
    organizationId: string;
    role: UserRole;
};
