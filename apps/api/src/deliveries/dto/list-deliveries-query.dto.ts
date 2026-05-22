import { IsEnum, IsOptional } from 'class-validator';
import { DeliveryStatus } from '../../generated/prisma/client';

export class ListDeliveriesQueryDto {
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;
}
