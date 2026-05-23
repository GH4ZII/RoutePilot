import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriversService } from './drivers.service';

@Controller('drivers/me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
export class DriversMeController {
  constructor(private readonly driversService: DriversService) {}

  @Patch('location')
  updateLocation(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateDriverLocationDto,
  ) {
    return this.driversService.updateMyLocation(user, dto);
  }
}
