import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/createStory.dto';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}
  @Get('health')
  health() {
    return 'up';
  }

  @Post('create')
  @UseGuards(AuthGuard)
  async createStory(
    @User() user: UserEntity,
    @Body('story') createStoryDto: CreateStoryDto,
  ) {
    const story = await this.storyService.createStory(createStoryDto, user);
    return story;
  }
}
