import { ForbiddenException, Injectable } from '@nestjs/common';
import type { JwtPayload } from '../auth/types/jwt-payload';

/**
 * Organization isolation helper.
 *
 * Every query for org-scoped models (User, Driver, Delivery, Route, …) MUST
 * include `organizationId` from the JWT — never trust IDs from the client alone.
 *
 * Example:
 *   this.prisma.delivery.findMany({
 *     where: this.orgScope.forOrganization(user, { status: 'PENDING' }),
 *   });
 */
@Injectable()
export class OrgScopeService {
  requireOrganizationId(user: JwtPayload): string {
    if (!user?.organizationId) {
      throw new ForbiddenException('Organization context required');
    }
    return user.organizationId;
  }

  /** Merge organizationId into a Prisma where clause. */
  forOrganization<T extends Record<string, unknown>>(
    user: JwtPayload,
    where: T = {} as T,
  ): T & { organizationId: string } {
    return {
      ...where,
      organizationId: this.requireOrganizationId(user),
    };
  }
}
