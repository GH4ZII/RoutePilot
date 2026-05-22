import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BuildMatrixDto } from './dto/build-matrix.dto';
import { RoutingService } from './routing.service';

@Controller('routing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class RoutingController {
  constructor(private readonly routing: RoutingService) {}

  /** Avstands- og reisetidsmatrise mellom alle punkter (OSRM). */
  @Post('matrix')
  buildMatrix(@Body() body: BuildMatrixDto) {
    return this.routing.buildDistanceTimeMatrix(body.points);
  }
}
