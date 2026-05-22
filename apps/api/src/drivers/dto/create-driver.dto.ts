import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { DriverStatus } from '../../generated/prisma/client';

export class CreateDriverDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  /** Innloggings-e-post (mobilapp). Påkrevd når userId ikke settes. */
  @ValidateIf((o: CreateDriverDto) => !o.userId)
  @IsEmail()
  email?: string;

  /** Passord for mobilinnlogging. Påkrevd når userId ikke settes. */
  @ValidateIf((o: CreateDriverDto) => !o.userId)
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password?: string;

  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  /** Koble til eksisterende bruker i stedet for å opprette ny. */
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;
}
