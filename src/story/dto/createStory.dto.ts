import { UserEntity } from '@app/user/user.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateStoryDto {
  slug: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  body: string;

  @IsNotEmpty()
  tagList: string[];

  createdAt: string;

  updatedAt: string;

  favorited: boolean;

  favoritesCount: number;

  author: UserEntity;
}
