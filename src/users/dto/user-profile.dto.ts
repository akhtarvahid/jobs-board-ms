import { IsString, IsOptional } from 'class-validator';

export class UserProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}