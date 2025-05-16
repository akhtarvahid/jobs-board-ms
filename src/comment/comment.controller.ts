import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { BuildResponse } from './types/buildResponse.interface';

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
}
