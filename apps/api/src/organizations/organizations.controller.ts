import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('me')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER, UserRole.DRIVER)
  getMe(@CurrentUser() user: JwtPayload) {
    return this.organizationsService.getMe(user);
  }

  @Patch('me')
  @Roles(UserRole.ADMIN)
  updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.updateMe(user, dto);
  }
}
