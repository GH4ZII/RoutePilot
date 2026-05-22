import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class ProofOfDeliveryDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  /** Data-URI eller URL til bilde (MVP). */
  @IsOptional()
  @IsString()
  @MaxLength(500_000)
  photoUrl?: string;
}
