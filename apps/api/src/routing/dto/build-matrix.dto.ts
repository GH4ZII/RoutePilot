import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { OSRM_MAX_POINTS } from '../osrm.service';

export class MatrixPointDto {
  @IsString()
  id!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}

export class BuildMatrixDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(OSRM_MAX_POINTS)
  @ValidateNested({ each: true })
  @Type(() => MatrixPointDto)
  points!: MatrixPointDto[];
}
