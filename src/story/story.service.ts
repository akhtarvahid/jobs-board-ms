import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/createStory.dto';
import { UserEntity } from '@app/user/user.entity';
import { StoryEntity } from './story.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
  ) {}

  async createStory(
    createStoryDto: CreateStoryDto,
    user: UserEntity,
  ): Promise<any> {
    const story = new StoryEntity();
    Object.assign(story, createStoryDto);

    story.slug = 'to-do'
    story.owner = user;

    const newStory = this.storyRepository.save(story);
    return newStory;
  }
}
