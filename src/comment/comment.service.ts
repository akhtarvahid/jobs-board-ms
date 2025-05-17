import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { StoryEntity } from '@app/story/story.entity';
import {
  BuildResponse,
  DeleteResponseType,
} from './types/buildResponse.interface';
import { UserEntity } from '@app/user/user.entity';

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
  async delete(
    user: UserEntity,
    commentId: number,
  ): Promise<DeleteResponseType> {
    let comment;

    comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: ['owner'],
    });
    // Check if current user is the owner
    if (comment.owner.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    if (comment) {
      await this.commentRepository.delete(comment.id);
    }

    return { message: `Comment ${comment?.id} is deleted successfully!` };
  }
  buildResponse(response: CommentEntity): BuildResponse {
    return {
      comment: response,
    };
  }
}
