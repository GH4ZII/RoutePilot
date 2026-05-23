import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { OrgScopeService } from '../common/org-scope.service';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly orgScope: OrgScopeService,
  ) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query('date') date?: string) {
    const organizationId = this.orgScope.requireOrganizationId(user);
    return this.notifications.listForOrganization(organizationId, date);
  }
}
