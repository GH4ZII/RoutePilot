import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: ListVehiclesQueryDto,
  ) {
    return this.vehiclesService.findAll(user, query);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(user, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.vehiclesService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(user, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.vehiclesService.remove(user, id);
  }
}
