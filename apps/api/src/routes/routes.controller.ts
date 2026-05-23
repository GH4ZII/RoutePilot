import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { AssignRouteDto } from './dto/assign-route.dto';
import { ListRoutesQueryDto } from './dto/list-routes-query.dto';
import { ReoptimizeRouteQueryDto } from './dto/reoptimize-route-query.dto';
import { RouteSummaryService } from './route-summary.service';
import { RoutesReoptimizeService } from './routes-reoptimize.service';
import { RoutesService } from './routes.service';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutesController {
  constructor(
    private readonly routes: RoutesService,
    private readonly reoptimize: RoutesReoptimizeService,
    private readonly summaries: RouteSummaryService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: ListRoutesQueryDto,
  ) {
    return this.routes.findAll(user, query);
  }

  @Get('me')
  @Roles(UserRole.DRIVER)
  findMyRoutes(@CurrentUser() user: JwtPayload) {
    return this.routes.findMyRoutes(user);
  }

  @Get('me/today')
  @Roles(UserRole.DRIVER)
  findMyToday(@CurrentUser() user: JwtPayload) {
    return this.routes.findMyToday(user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER, UserRole.DRIVER)
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.routes.findOne(user, id);
  }

  @Post(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  assign(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AssignRouteDto,
  ) {
    return this.routes.assign(user, id, dto.driverId);
  }

  @Post(':id/start')
  @Roles(UserRole.DRIVER, UserRole.ADMIN, UserRole.DISPATCHER)
  start(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.routes.start(user, id);
  }

  @Post(':id/finish')
  @Roles(UserRole.DRIVER, UserRole.ADMIN, UserRole.DISPATCHER)
  finish(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.routes.finish(user, id);
  }

  @Post(':id/reoptimize')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  reoptimizeRoute(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Query() query: ReoptimizeRouteQueryDto,
  ) {
    return this.reoptimize.reoptimize(
      user,
      id,
      query.includeDeliveryIds ?? [],
    );
  }

  @Get(':id/summary')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  getSummary(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.summaries.getSummary(user, id);
  }

  @Post(':id/summary')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  generateSummary(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.summaries.generateSummary(user, id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.routes.remove(user, id);
  }
}
