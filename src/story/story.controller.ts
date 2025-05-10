import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/createStory.dto';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { StoryResponseInterface } from './types/buildStoryResponse.type';
import { UpdateStoryDto } from './dto/updateStory.dto';

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
  ): Promise<StoryResponseInterface> {
    const story = await this.storyService.createStory(createStoryDto, user);
    return this.storyService.buildStoryResponse(story);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateStory(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('story') updateStoryDto: UpdateStoryDto,
  ): Promise<StoryResponseInterface> {
    const story = await this.storyService.updateStory(
      updateStoryDto,
      slug,
      user,
    );
    return this.storyService.buildStoryResponse(story);
  }

  @Get(':slug')
  async findAStory(
    @Param('slug') slug: string,
  ): Promise<StoryResponseInterface> {
    const story = await this.storyService.findBySlug(slug);
    return this.storyService.buildStoryResponse(story);
  }

  @Delete(':slug')
  async deleteAStory(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<{ message: string }> {
    return await this.storyService.deleteBySlug(userId, slug);
  }
}
