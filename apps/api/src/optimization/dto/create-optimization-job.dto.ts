import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { OptimizationObjective } from '../../generated/prisma/client';

export class CreateOptimizationJobDto {
  /** Planlagt leveringsdag (YYYY-MM-DD). */
  @IsDateString()
  plannedDate!: string;

  /** Én bil (bakoverkompatibel med fase 4). */
  @ValidateIf((o: CreateOptimizationJobDto) => !o.vehicleIds?.length)
  @IsString()
  vehicleId?: string;

  /** Flere kjøretøy for VRP (fase 5). */
  @ValidateIf((o: CreateOptimizationJobDto) => !o.vehicleId)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  vehicleIds?: string[];

  /** Valgfri sjåfør per kjøretøy (samme rekkefølge som vehicleIds). */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  driverIds?: string[];

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

  @IsOptional()
  @IsBoolean()
  respectCapacity?: boolean;

  @IsOptional()
  @IsBoolean()
  respectTimeWindows?: boolean;
}
