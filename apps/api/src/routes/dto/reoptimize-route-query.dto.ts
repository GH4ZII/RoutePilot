import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReoptimizeRouteQueryDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (value == null || value === '') return [];
    if (Array.isArray(value)) return value;
    return String(value)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  })
  includeDeliveryIds?: string[];
}
