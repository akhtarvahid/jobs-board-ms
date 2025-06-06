import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class UpdateStory {
  @ApiProperty({ example: 'title', required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'description', required: true })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'body', required: true })
  @IsNotEmpty()
  body: string;
}

export class UpdateStoryDto {
  @ApiProperty({
    type: UpdateStory,
  })
  @ValidateNested()
  story: UpdateStory;
}
