import { IsString, MaxLength, MinLength } from 'class-validator';

export class SuggestAddressQueryDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  q: string;
}
