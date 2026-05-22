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
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ListDeliveriesQueryDto } from './dto/list-deliveries-query.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveriesService } from './deliveries.service';

@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: ListDeliveriesQueryDto,
  ) {
    return this.deliveriesService.findAll(user, query);
  }

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.create(user, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.deliveriesService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryDto,
  ) {
    return this.deliveriesService.update(user, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.deliveriesService.remove(user, id);
  }
}
