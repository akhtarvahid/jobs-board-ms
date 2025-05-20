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
import { StoryResponse } from './types/buildStoryResponse.type';
import { UpdateStoryDto } from './dto/updateStory.dto';
import { GlobalValidationPipe } from '@app/shared/pipes/global-validation.pipe';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AllStoryResponse } from './types/all-story-response.type';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}
  @Get('health')
  health() {
    return 'up';
  }

  @Get('all')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all the story',
    description: 'Returns all the story of the authenticated user',
  })
  @ApiOkResponse({
    description: 'Returns all stories with count',
    type: AllStoryResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: No token provided',
  })
  @UseGuards(AuthGuard)
  async findAllStory(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<AllStoryResponse> {
    return await this.storyService.findAll(userId, query);
  }

  @Get('feed')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get logged in user all the feed story',
    description: 'Returns logged in user feed story',
  })
  @ApiOkResponse({
    description: 'Returns all logged in user feed story with count',
    type: AllStoryResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: No token provided',
  })
  @UseGuards(AuthGuard)
  async userStories(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<any> {
    return await this.storyService.findUserStories(userId, query);
  }

  @Get(':storyId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get a story',
    description: 'Return a story',
  })
  @ApiOkResponse({
    description: 'Returns a single story',
    type: StoryResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: No token provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Story not found!',
  })
  @UseGuards(AuthGuard)
  async findAStory(@Param('storyId') storyId: string): Promise<StoryResponse> {
    const story = await this.storyService.findBySlug(storyId);
    return this.storyService.buildStoryResponse(story);
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createStory(
    @User() user: UserEntity,
    @Body('story') createStoryDto: CreateStoryDto,
  ): Promise<StoryResponse> {
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
  ): Promise<StoryResponse> {
    const story = await this.storyService.updateStory(
      updateStoryDto,
      slug,
      user,
    );
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
  ): Promise<StoryResponse> {
    const story = await this.storyService.likeStory(slug, user);
    return this.storyService.buildStoryResponse(story);
  }

  @Delete(':slug/like')
  @UseGuards(AuthGuard)
  async dislikeStory(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<StoryResponse> {
    const story = await this.storyService.dislikeStory(slug, user.id);
    return this.storyService.buildStoryResponse(story);
  }
}
