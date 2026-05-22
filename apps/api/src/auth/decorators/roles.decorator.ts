import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../generated/prisma/client';

export const ROLES_KEY = 'roles';

/** Restrict route to one or more roles (use with RolesGuard + JwtAuthGuard). */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
