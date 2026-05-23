import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import {
  DailyReportQueryDto,
  RangeReportQueryDto,
} from './dto/reports-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  getDaily(
    @CurrentUser() user: JwtPayload,
    @Query() query: DailyReportQueryDto,
  ) {
    return this.reportsService.getDaily(user, query);
  }

  @Get('driver-performance')
  getDriverPerformance(
    @CurrentUser() user: JwtPayload,
    @Query() query: RangeReportQueryDto,
  ) {
    return this.reportsService.getDriverPerformance(user, query);
  }

  @Get('route-efficiency')
  getRouteEfficiency(
    @CurrentUser() user: JwtPayload,
    @Query() query: RangeReportQueryDto,
  ) {
    return this.reportsService.getRouteEfficiency(user, query);
  }
}
