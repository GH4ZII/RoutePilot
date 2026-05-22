import { IsEnum, IsOptional } from 'class-validator';
import { DriverStatus } from '../../generated/prisma/client';

export class ListDriversQueryDto {
  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;
}
