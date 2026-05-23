import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(
    @CurrentUser() user: JwtPayload,
    @Query() query: DashboardQueryDto,
  ) {
    return this.dashboardService.getSummary(user, query);
  }

  @Get('routes/live')
  getLiveRoutes(
    @CurrentUser() user: JwtPayload,
    @Query() query: DashboardQueryDto,
  ) {
    return this.dashboardService.getLiveRoutes(user, query);
  }

  @Get('deliveries/status')
  getDeliveriesStatus(
    @CurrentUser() user: JwtPayload,
    @Query() query: DashboardQueryDto,
  ) {
    return this.dashboardService.getDeliveriesStatus(user, query);
  }
}
