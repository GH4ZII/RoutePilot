import { IsEnum, IsOptional } from 'class-validator';
import { RouteStatus } from '../../generated/prisma/client';

export class ListRoutesQueryDto {
  @IsOptional()
  @IsEnum(RouteStatus)
  status?: RouteStatus;
}
