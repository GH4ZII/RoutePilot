import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  DeliveryPriority,
  DeliveryStatus,
} from '../../generated/prisma/client';

export class CreateDeliveryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  customerName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  address: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNumber()
  @Min(0.01)
  weightKg: number;

  @IsOptional()
  @IsNumber()
  @Min(0.001)
  volumeM3?: number;

  @IsOptional()
  @IsEnum(DeliveryPriority)
  priority?: DeliveryPriority;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsDateString()
  timeWindowStart?: string;

  @IsOptional()
  @IsDateString()
  timeWindowEnd?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;
}
