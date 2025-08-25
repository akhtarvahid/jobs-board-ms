import { ApiProperty } from '@nestjs/swagger';

class OwnerResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'User bio', required: false })
  bio: string;

  @ApiProperty({ example: '', required: false })
  image: string;
}

class StoryResponse {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'my-story-kdurse' })
  slug: string;

  @ApiProperty({ example: 'My Story' })
  title: string;

  @ApiProperty({ example: 'Story description' })
  description: string;

  @ApiProperty({ example: 'Story body content' })
  body: string;

  @ApiProperty({ example: '2025-05-16T12:49:01.866Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-16T12:49:01.866Z' })
  modifiedAt: Date;

  @ApiProperty({ example: ['tag1', 'tag2'], type: [String] })
  tagList: string[];

  @ApiProperty({ example: 0 })
  favoritesCount: number;

  @ApiProperty({ type: OwnerResponse })
  owner: OwnerResponse;

  @ApiProperty({ example: false })
  favorited: boolean;
}

export class AllStoryResponse {
  @ApiProperty({ type: [StoryResponse] })
  stories: StoryResponse[];

  @ApiProperty({ example: 5 })
  storiesCount: number;
}
