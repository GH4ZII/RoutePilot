import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsPodPhotoUrl } from '../validators/is-pod-photo-url.validator';
import { IsPodSignatureUrl } from '../validators/is-pod-signature-url.validator';

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

  @IsOptional()
  @IsDateString()
  capturedAt?: string;

  @IsOptional()
  @IsString()
  @IsPodPhotoUrl()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  @IsPodSignatureUrl()
  signatureUrl?: string;
}
