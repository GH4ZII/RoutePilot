import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
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
  @IsNumber()
  @Min(0.01)
  maxWeightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.001)
  maxVolumeM3?: number;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  startLatitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  startLongitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  endLatitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  endLongitude?: number;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
