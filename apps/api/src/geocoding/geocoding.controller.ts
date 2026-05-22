import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '../generated/prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SuggestAddressQueryDto } from './dto/suggest-address-query.dto';
import { GeocodingService } from './geocoding.service';

@Controller('geocoding')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DISPATCHER)
export class GeocodingController {
  constructor(private readonly geocoding: GeocodingService) {}

  @Get('suggest')
  suggest(@Query() query: SuggestAddressQueryDto) {
    return this.geocoding.suggest(query.q);
  }
}
