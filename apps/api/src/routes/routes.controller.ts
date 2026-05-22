import {
  Body,
  Controller,
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
import { RoutesService } from './routes.service';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutesController {
  constructor(private readonly routes: RoutesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: ListRoutesQueryDto,
  ) {
    return this.routes.findAll(user, query);
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
}
