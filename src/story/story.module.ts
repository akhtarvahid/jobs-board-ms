import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryEntity } from './story.entity';
import { UserEntity } from '@app/user/user.entity';
import { FollowEntity } from '@app/profile/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoryEntity, UserEntity, FollowEntity])],
  providers: [StoryService, AuthGuard],
  controllers: [StoryController],
})
export class StoryModule {}
