import { IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../application-status.enum';

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;
}