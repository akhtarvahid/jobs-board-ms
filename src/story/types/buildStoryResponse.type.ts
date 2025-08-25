import { ApiProperty } from '@nestjs/swagger';

// Owner DTO
export class StoryOwnerDto {
  @ApiProperty({ example: 3, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({
    example: "It's beginning to build the world!",
    description: 'User bio',
    required: false,
  })
  bio: string;

  @ApiProperty({
    example: 'http://unsplash.com/hair-color.png',
    description: 'User profile image URL',
    required: false,
  })
  image: string;
}

// Story DTO
export class SingleStoryDto {
  @ApiProperty({ example: 8, description: 'Story ID' })
  id: string;

  @ApiProperty({
    example: 'advance-js-3-cqa8qf',
    description: 'URL-friendly story slug',
  })
  slug: string;

  @ApiProperty({ example: 'Advance Js 3', description: 'Story title' })
  title: string;

  @ApiProperty({
    example: 'Did you ever wonder how?',
    description: 'Short description',
  })
  description: string;

  @ApiProperty({
    example: 'Believe it or not!',
    description: 'Main content body',
  })
  body: string;

  @ApiProperty({
    example: '2025-05-20T11:55:27.690Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-05-20T11:55:27.690Z',
    description: 'Last modification timestamp',
  })
  modifiedAt: Date;

  @ApiProperty({
    type: [String],
    example: ['JS', 'ES6'],
    description: 'List of tags',
  })
  tagList: string[];

  @ApiProperty({
    example: 0,
    description: 'Number of times story was favorited',
  })
  favoritesCount: number;

  @ApiProperty({
    type: StoryOwnerDto,
    description: 'Story owner details',
  })
  owner: StoryOwnerDto;
}
export class StoryResponse {
  @ApiProperty({
    type: SingleStoryDto,
    description: 'The story object',
  })
  story: SingleStoryDto;
}
