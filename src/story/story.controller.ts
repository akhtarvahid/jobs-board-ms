import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { GlobalValidationPipe } from '@app/shared/pipes/global-validation.pipe';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}
  @Get('health')
  health() {
    return 'up';
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async findAllStory(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<any> {
    return await this.storyService.findAll(userId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async userStories(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<any> {
    return await this.storyService.findUserStories(userId, query);
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
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

  @Post(':slug/like')
  @UseGuards(AuthGuard)
  async likeStory(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<StoryResponseInterface> {
    const story = await this.storyService.likeStory(slug, user);
    return this.storyService.buildStoryResponse(story);
  }

  @Delete(':slug/like')
  @UseGuards(AuthGuard)
  async dislikeStory(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<StoryResponseInterface> {
    const story = await this.storyService.dislikeStory(slug, user.id);
    return this.storyService.buildStoryResponse(story);
  }
}
