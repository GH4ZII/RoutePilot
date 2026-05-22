import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { VehicleStatus } from '../../generated/prisma/client';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  startAddress?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  endAddress?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  maxWeightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.001)
  maxVolumeM3?: number;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
