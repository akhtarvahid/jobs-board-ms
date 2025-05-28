import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateStoryDto } from './dto/createStory.dto';
import { UserEntity } from '@app/user/user.entity';
import { StoryEntity } from './story.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StoryResponse } from './types/buildStoryResponse.type';
import slugify from 'slugify';
import { UpdateStoryDto } from './dto/updateStory.dto';
import { FollowEntity } from '@app/profile/follow.entity';
import { AllStoryResponse } from './types/all-story-response.type';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly profileRepository: Repository<FollowEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(userId: number, query: any): Promise<AllStoryResponse> {
    const queryBuilder = this.dataSource
      .getRepository(StoryEntity)
      .createQueryBuilder('storyQuery')
      .leftJoinAndSelect('storyQuery.owner', 'owner');

    // filter by tag
    if (query.tag) {
      queryBuilder.andWhere('storyQuery.tagList ILIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    // filter by owner
    if (query.owner) {
      const owner = await this.userRepository.findOne({
        where: {
          username: query.owner,
        },
      });

      if (!owner) {
        throw new HttpException(
          'Username does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      queryBuilder.andWhere('storyQuery.ownerId = :id', {
        id: owner.id,
      });
    }

    if (query.favorited) {
      const owner = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });

      const ids = owner?.favorites.map((fav) => fav.id);
      if (ids && ids?.length > 0) {
        queryBuilder.andWhere('storyQuery.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    queryBuilder.orderBy('storyQuery.createdAt', 'DESC');
    const storiesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    // Favorited:true/false logic
    let favoriteIds: number[] = [];
    if (userId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['favorites'],
      });

      if (!currentUser) {
        throw new HttpException('User not found!', HttpStatus.FORBIDDEN);
      }
      favoriteIds = currentUser.favorites.map((fav) => parseInt(fav.id));
    }
    const stories = await queryBuilder.getMany();
    const storyWithFavorited = stories.map((story) => {
      const favorited = favoriteIds.includes(parseInt(story.id));
      return { ...story, favorited };
    });

    return { stories: storyWithFavorited, storiesCount };
  }
  async findUserStories(userId: number, query: any): Promise<any> {
    const followingUsersStories = await this.profileRepository.find({
      where: {
        followerId: userId.toString(),
      },
    });

    if (followingUsersStories.length === 0) {
      return { stories: [], storiesCount: 0 };
    }

    const followingUsersStoryIds = followingUsersStories.map(
      (fusId) => fusId.followingId,
    );
    const queryBuilder = this.dataSource
      .getRepository(StoryEntity)
      .createQueryBuilder('storyQuery')
      .leftJoinAndSelect('storyQuery.owner', 'owner')
      .andWhere('storyQuery.ownerId IN (:...ids)', {
        ids: followingUsersStoryIds,
      })
      .orderBy('storyQuery.modifiedAt', 'DESC');

    const feedStoriesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const feedStories = await queryBuilder.getMany();

    return {
      stories: feedStories,
      storiesCount: feedStoriesCount,
    };
  }
  async createStory(
    createStoryDto: CreateStoryDto,
    user: UserEntity,
  ): Promise<StoryEntity> {
    const story = new StoryEntity();
    Object.assign(story, createStoryDto);

    story.slug = this.getSlug(story.title);
    story.owner = user;

    return await this.storyRepository.save(story);
  }
  async updateStory(
    updateStoryDto: UpdateStoryDto,
    slug: string,
    user: UserEntity,
  ): Promise<StoryEntity> {
    const story = await this.findBySlug(slug);
    if (story && story.owner.id !== user.id) {
      throw new HttpException(
        'You are not authorized to perform',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (Object.keys(updateStoryDto).length === 0) {
      throw new HttpException(
        'Request body cannot be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(story, updateStoryDto);

    return await this.storyRepository.save(story);
  }
  async findBySlug(slug: string): Promise<StoryEntity> {
    const story = await this.storyRepository.findOne({
      where: {
        slug,
      },
    });
    if (!story) {
      throw new HttpException('Story not found!', HttpStatus.NOT_FOUND);
    }

    return story;
  }
  async findById(storyId: string): Promise<StoryEntity> {
    const story = await this.storyRepository.findOne({
      where: {
        id: storyId,
      },
    });
    if (!story) {
      throw new HttpException('Story not found!', HttpStatus.NOT_FOUND);
    }

    return story;
  }
  async deleteBySlug(
    userId: number,
    slug: string,
  ): Promise<{ message: string }> {
    const story = await this.findBySlug(slug);

    if (userId !== story.owner.id) {
      throw new HttpException(
        'You do not have permission to modify this story',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.storyRepository.delete(story.id);
    return {
      message: `Post with ID "${slug}" deleted successfully`,
    };
  }
  async likeStory(slug: string, user: UserEntity): Promise<StoryEntity> {
    const story = await this.findBySlug(slug);
    const currentuser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favorites'],
    });

    if (!currentuser) {
      throw new HttpException('Not a valid user!', HttpStatus.FORBIDDEN);
    }
    const isNotFavorite =
      currentuser.favorites.findIndex(
        (storyInFavorites) => storyInFavorites.id === story.id,
      ) === -1;

    if (isNotFavorite) {
      currentuser.favorites.push(story);
      story.favoritesCount++;
      await this.userRepository.save(currentuser);
      await this.storyRepository.save(story);
    }

    return story;
  }
  async dislikeStory(slug: string, userId: number): Promise<StoryEntity> {
    const story = await this.findBySlug(slug);
    const currentuser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!currentuser) {
      throw new HttpException('Not a valid user!', HttpStatus.FORBIDDEN);
    }
    const storyIndex = currentuser.favorites.findIndex(
      (storyInFavorites) => storyInFavorites.id === story.id,
    );
    if (storyIndex >= 0) {
      currentuser.favorites.splice(storyIndex, 1);
      story.favoritesCount--;
      await this.userRepository.save(currentuser);
      await this.storyRepository.save(story);
    }

    return story;
  }
  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  buildStoryResponse(response: StoryEntity): StoryResponse {
    return {
      story: response,
    };
  }
}
