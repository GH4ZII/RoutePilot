import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  DeliveryPriority,
  DeliveryStatus,
} from '../../generated/prisma/client';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  customerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.001)
  volumeM3?: number;

  @IsOptional()
  @IsEnum(DeliveryPriority)
  priority?: DeliveryPriority;

  @IsOptional()
  @IsDateString()
  deadline?: string | null;

  @IsOptional()
  @IsDateString()
  timeWindowStart?: string | null;

  @IsOptional()
  @IsDateString()
  timeWindowEnd?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;
}
