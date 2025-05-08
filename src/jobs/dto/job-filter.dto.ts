import { IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { JobType } from '../job-type.enum';

export class JobFilterDto {
  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  search?: string;
}