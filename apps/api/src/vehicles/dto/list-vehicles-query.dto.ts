import { IsEnum, IsOptional } from 'class-validator';
import { VehicleStatus } from '../../generated/prisma/client';

export class ListVehiclesQueryDto {
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
