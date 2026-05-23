import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
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
import { ReportsExportService } from './reports-export.service';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly exportService: ReportsExportService,
  ) {}

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

  @Get('planned-vs-actual')
  getPlannedVsActual(
    @CurrentUser() user: JwtPayload,
    @Query() query: RangeReportQueryDto,
  ) {
    return this.reportsService.getPlannedVsActual(user, query);
  }

  @Get('daily/export.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportDailyCsv(
    @CurrentUser() user: JwtPayload,
    @Query() query: DailyReportQueryDto,
    @Res() res: Response,
  ) {
    const csv = await this.exportService.exportDailyCsv(user, query);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="daily-${query.date ?? 'today'}.csv"`,
    );
    res.send(csv);
  }

  @Get('route-efficiency/export.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportRouteEfficiencyCsv(
    @CurrentUser() user: JwtPayload,
    @Query() query: RangeReportQueryDto,
    @Res() res: Response,
  ) {
    const csv = await this.exportService.exportRouteEfficiencyCsv(user, query);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="route-efficiency.csv"',
    );
    res.send(csv);
  }

  @Get('routes/:id/export.pdf')
  async exportRoutePdf(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdf = await this.exportService.exportRoutePdf(user, id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="route-${id}.pdf"`,
    );
    res.send(pdf);
  }
}
