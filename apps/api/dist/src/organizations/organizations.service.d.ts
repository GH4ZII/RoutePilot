import { OrgScopeService } from '../common/org-scope.service';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export type OrganizationResponse = {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
};
export declare class OrganizationsService {
    private readonly prisma;
    private readonly orgScope;
    constructor(prisma: PrismaService, orgScope: OrgScopeService);
    getMe(user: JwtPayload): Promise<OrganizationResponse>;
    updateMe(user: JwtPayload, dto: UpdateOrganizationDto): Promise<OrganizationResponse>;
    assertSameOrganization(user: JwtPayload, resourceOrganizationId: string): void;
}
