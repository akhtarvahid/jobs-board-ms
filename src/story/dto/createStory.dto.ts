import { UserEntity } from '@app/user/user.entity';

export class CreateStoryDto {
  slug: string;

  title: string;

  description: string;

  body: string;

  tagList: string[];

  createdAt: string;

  updatedAt: string;

  favorited: boolean;

  favoritesCount: number;

  author: UserEntity;
}
