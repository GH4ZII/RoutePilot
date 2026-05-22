import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { FailRouteStopDto } from './dto/fail-route-stop.dto';
import { ProofOfDeliveryDto } from './dto/proof-of-delivery.dto';
import { RouteStopsService } from './route-stops.service';

@Controller('route-stops')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RouteStopsController {
  constructor(private readonly routeStops: RouteStopsService) {}

  @Post(':id/complete')
  @Roles(UserRole.DRIVER, UserRole.ADMIN, UserRole.DISPATCHER)
  complete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.routeStops.complete(user, id);
  }

  @Post(':id/fail')
  @Roles(UserRole.DRIVER, UserRole.ADMIN, UserRole.DISPATCHER)
  fail(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: FailRouteStopDto,
  ) {
    return this.routeStops.fail(user, id, dto);
  }

  @Post(':id/proof')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  proof(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: ProofOfDeliveryDto,
  ) {
    return this.routeStops.submitProof(user, id, dto);
  }
}
