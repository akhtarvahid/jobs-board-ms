import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { DataSource, Repository } from 'typeorm';
import { StoryEntity } from '@app/story/story.entity';
import {
  BuildResponse,
  CommentsResponseType,
  DeleteResponseType,
} from './types/response.interface';
import { UserEntity } from '@app/user/user.entity';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(slug: string): Promise<CommentsResponseType> {
    const queryBuilder = this.dataSource
      .getRepository(CommentEntity)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.owner', 'owner')
      .leftJoin('comment.story', 'story')
      .where('story.slug = :slug', { slug });

    queryBuilder.orderBy('comment.createdAt', 'DESC');
    const storyCommentsCount = await queryBuilder.getMany();

    return { comments: storyCommentsCount };
  }

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
  async update(
    user: UserEntity,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: {
        owner: true,
        story: true,
      },
      select: {
        story: { id: true, title: true },
        owner: { id: true, username: true, email: true },
      },
    });

    if (!comment) {
      throw new HttpException(
        'Comment does not exist!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (comment.owner?.id !== user.id) {
      throw new ForbiddenException('You can only update your own comments');
    }
    Object.assign(comment, updateCommentDto);

    return await this.commentRepository.save({
      ...{
        ...comment,
        story: { id: comment.story.id, title: comment.story.title },
      },
      owner: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  }

  async delete(
    user: UserEntity,
    commentId: number,
  ): Promise<DeleteResponseType> {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: ['owner'],
      select: ['owner'],
    });
    if (!comment) {
      throw new HttpException(
        'Comment not found!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Check if current user is the owner
    if (comment?.owner.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.delete(comment.id);

    return { message: `Comment ${comment?.id} is deleted successfully!` };
  }
  buildResponse(response: CommentEntity): BuildResponse {
    return {
      comment: response,
    };
  }
}
