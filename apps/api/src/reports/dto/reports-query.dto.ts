import { IsDateString, IsOptional, IsString } from 'class-validator';

export class DailyReportQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class RangeReportQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  driverId?: string;
}
