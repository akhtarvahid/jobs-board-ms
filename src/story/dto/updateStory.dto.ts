import { IsNotEmpty } from 'class-validator';

export class UpdateStoryDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  body: string;
}
