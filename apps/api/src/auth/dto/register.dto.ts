import {
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class RegisterDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    organizationName: string;
  
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'organizationSlug must be lowercase letters, numbers, and hyphens',
    })
    organizationSlug: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
  }