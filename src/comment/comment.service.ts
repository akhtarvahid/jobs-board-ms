import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { StoryEntity } from '@app/story/story.entity';
import { BuildResponse } from './types/buildResponse.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
  ) {}

  async create(user, slug, createCommentDto): Promise<CommentEntity> {
    const story = await this.storyRepository.findOne({
      where: {
        slug,
      },
    });
    if (!story) {
      throw new HttpException('Story not found!', HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepository.save({
      ...createCommentDto,
      story,
      owner: user,
    });
    return comment;
  }
  buildResponse(response: CommentEntity): BuildResponse {
    return {
      comment: response,
    };
  }
}
