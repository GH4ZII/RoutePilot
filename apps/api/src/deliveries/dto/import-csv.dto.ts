import { IsOptional, IsString } from 'class-validator';

export class ImportCsvBodyDto {
  /** Raw CSV text when not using multipart file upload. */
  @IsOptional()
  @IsString()
  csv?: string;
}
