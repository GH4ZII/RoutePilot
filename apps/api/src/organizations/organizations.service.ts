import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgScope: OrgScopeService,
  ) {}

  async getMe(user: JwtPayload): Promise<OrganizationResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);

    const organization = await this.prisma.organization.findFirst({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async updateMe(
    user: JwtPayload,
    dto: UpdateOrganizationDto,
  ): Promise<OrganizationResponse> {
    const organizationId = this.orgScope.requireOrganizationId(user);

    const existing = await this.prisma.organization.findFirst({
      where: { id: organizationId },
    });

    if (!existing) {
      throw new NotFoundException('Organization not found');
    }

    if (!dto.name) {
      return existing;
    }

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: { name: dto.name },
    });
  }

  /** Ensures a resource belongs to the caller's organization (use before returning by id). */
  assertSameOrganization(
    user: JwtPayload,
    resourceOrganizationId: string,
  ): void {
    const organizationId = this.orgScope.requireOrganizationId(user);
    if (resourceOrganizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }
  }
}
