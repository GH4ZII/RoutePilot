import type { UserRole } from '../../generated/prisma/client';

/** JWT access token claims — use with @CurrentUser() on protected routes. */
export type JwtPayload = {
  sub: string;
  organizationId: string;
  role: UserRole;
};
