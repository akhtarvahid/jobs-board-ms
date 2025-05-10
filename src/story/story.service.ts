import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/createStory.dto';
import { UserEntity } from '@app/user/user.entity';
import { StoryEntity } from './story.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryResponseInterface } from './types/buildStoryResponse.type';
import slugify from 'slugify';
import { UpdateStoryDto } from './dto/updateStory.dto';

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
  async updateStory(
    updateStoryDto: UpdateStoryDto,
    slug: string,
    user: UserEntity,
  ): Promise<StoryEntity> {
    const story = await this.findBySlug(slug);
    if (story.owner.id !== user.id) {
      throw new HttpException(
        'You are not authorized to perform',
        HttpStatus.BAD_GATEWAY, // check and change
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
  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  buildStoryResponse(response: StoryEntity): StoryResponseInterface {
    return {
      story: response,
    };
  }
}
