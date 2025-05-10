import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/createStory.dto';
import { UserEntity } from '@app/user/user.entity';
import { StoryEntity } from './story.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryResponseInterface } from './types/buildStoryResponse.type';
import slugify from 'slugify';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
  ) {}

  async createStory(
    createStoryDto: CreateStoryDto,
    user: UserEntity,
  ): Promise<StoryEntity> {
    const story = new StoryEntity();
    Object.assign(story, createStoryDto);

    story.slug = this.getSlug(story.title);
    story.owner = user;

    return this.storyRepository.save(story);
  }
  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
  async buildStoryResponse(response): Promise<StoryResponseInterface> {
    return {
      story: { ...response },
    };
  }
}
