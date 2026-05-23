import { IsDateString, IsOptional } from 'class-validator';

export class DashboardQueryDto {
  /** ISO date (YYYY-MM-DD). Defaults to today (server local date). */
  @IsOptional()
  @IsDateString()
  date?: string;
}
