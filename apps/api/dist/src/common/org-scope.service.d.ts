import type { JwtPayload } from '../auth/types/jwt-payload';
export declare class OrgScopeService {
    requireOrganizationId(user: JwtPayload): string;
    forOrganization<T extends Record<string, unknown>>(user: JwtPayload, where?: T): T & {
        organizationId: string;
    };
}
