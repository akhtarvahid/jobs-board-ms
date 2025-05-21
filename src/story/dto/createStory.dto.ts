import { UserEntity } from '@app/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

export class CreateStory {
  slug: string;

  @ApiProperty({ example: 'EcmaScript', required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn modern js ecmaScript', required: true })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'ecmaScript from official doc', required: true })
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: ['tag1', 'tag2'], type: [String], required: true })
  @ArrayMinSize(1, { message: 'tagList array can not be blank' })
  tagList: string[];

  @ApiProperty({
    type: Date,
    example: '2025-05-16T12:49:01.866Z',
    required: false,
    default: '2025-05-16T12:49:01.866Z',
  })
  @IsOptional()
  createdAt: string;

  @ApiProperty({
    type: Date,
    example: '2025-05-16T12:49:01.866Z',
    required: false,
    default: '2025-05-16T12:49:01.866Z',
  })
  @IsOptional()
  updatedAt: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  favorited: boolean;

  @ApiProperty({ type: Number, example: 0, required: false, default: 0 })
  @IsOptional()
  favoritesCount?: number;

  author: UserEntity;
}

export class CreateStoryDto {
  @ApiProperty({
    type: CreateStory,
  })
  @ValidateNested()
  user: CreateStory;
}