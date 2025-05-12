import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileResponse.type';
import { AuthGuard } from '@app/user/guards/auth.guard';

@Controller('profile')
export class ProfileController {
  @Inject() profileService: ProfileService;
  @Get('health')
  health() {
    return 'up';
  }

  @Get(':username')
  async getProfile(
    @User('userId') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(username, userId);
    return this.profileService.buildResponseType(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.follow(username, userId);
    return this.profileService.buildResponseType(profile);
  }
}
