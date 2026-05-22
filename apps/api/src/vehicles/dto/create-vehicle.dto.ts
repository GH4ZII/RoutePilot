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

export class CreateVehicleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  registrationNumber: string;

  @IsNumber()
  @Min(0.01)
  maxWeightKg: number;

  @IsNumber()
  @Min(0.001)
  maxVolumeM3: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  startLatitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  startLongitude: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  endLatitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  endLongitude: number;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
