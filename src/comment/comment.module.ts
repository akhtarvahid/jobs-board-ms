import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { StoryEntity } from '@app/story/story.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, StoryEntity])],
  providers: [CommentService, AuthGuard],
  controllers: [CommentController],
})
export class CommentModule {}
