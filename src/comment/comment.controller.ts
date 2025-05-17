import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import {
  BuildResponse,
  DeleteResponseType,
} from './types/buildResponse.interface';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('story/:slug')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Get()
  health() {
    return 'up';
  }

  @Post('/comment')
  @UseGuards(AuthGuard)
  async createComment(
    @User() user: UserEntity,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<BuildResponse> {
    const comment = await this.commentService.create(
      user,
      slug,
      createCommentDto,
    );
    return this.commentService.buildResponse(comment);
  }
  @Put('/comment/:id')
  @UseGuards(AuthGuard)
  async updateComment(
    @User() user: UserEntity,
    @Param('id') commentId: number,
    @Body('comment') updateCommentDto: UpdateCommentDto,
  ): Promise<BuildResponse> {
    const updatedComment = await this.commentService.update(
      user,
      commentId,
      updateCommentDto,
    );

    return this.commentService.buildResponse(updatedComment);
  }

  @Delete('/comment/:id')
  @UseGuards(AuthGuard)
  async deleteComment(
    @User() user: UserEntity,
    @Param('id') commentId: number,
  ): Promise<DeleteResponseType> {
    return await this.commentService.delete(user, commentId);
  }
}
