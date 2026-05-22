import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { ListRoutesQueryDto } from './dto/list-routes-query.dto';
import { RoutesService } from './routes.service';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class RoutesController {
  constructor(private readonly routes: RoutesService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: ListRoutesQueryDto,
  ) {
    return this.routes.findAll(user, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.routes.findOne(user, id);
  }
}
