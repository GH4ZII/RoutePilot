import { IsString } from 'class-validator';

export class AssignRouteDto {
  @IsString()
  driverId!: string;
}
