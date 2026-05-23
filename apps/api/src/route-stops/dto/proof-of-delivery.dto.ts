import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsPodPhotoUrl } from '../validators/is-pod-photo-url.validator';

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

  /** JPEG/PNG data-URI (maks 500 KB dekodet). */
  @IsOptional()
  @IsString()
  @IsPodPhotoUrl()
  photoUrl?: string;
}
