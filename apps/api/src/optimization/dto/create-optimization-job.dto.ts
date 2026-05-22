import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { OptimizationObjective } from '../../generated/prisma/client';

export class CreateOptimizationJobDto {
  /** Planlagt leveringsdag (YYYY-MM-DD). */
  @IsDateString()
  plannedDate!: string;

  @IsString()
  vehicleId!: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  deliveryIds!: string[];

  @IsOptional()
  @IsEnum(OptimizationObjective)
  objective?: OptimizationObjective;

  /** Klokkeslett første avgang, lokal tid (HH:mm). Standard 08:00. */
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  routeStartTime?: string;

  @IsOptional()
  @IsBoolean()
  returnToDepot?: boolean;
}
