import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ProfileResponseInterface,
  ProfileType,
} from './types/profileResponse.type';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly profileRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(username: string, userId: number): Promise<ProfileType> {
    const user = await this.findByUsername(username);
    return {
      ...user,
      following: false,
    };
  }
  async follow(username: string, userId: number): Promise<ProfileType> {
    const followingUser = await this.findByUsername(username);

    if (followingUser.id === userId) {
      throw new HttpException(
        "Follower and following can't be equal",
        HttpStatus.BAD_REQUEST,
      );
    }

    const followedProfile = await this.profileRepository.findOne({
      where: {
        followerId: userId.toString(),
        followingId: followingUser.id.toString(),
      },
    });
    if (!followedProfile) {
      const follow = new FollowEntity();
      follow.followerId = userId.toString();
      follow.followingId = followingUser.id.toString();
      await this.profileRepository.save(follow);
    }
    return {
      ...followingUser,
      following: true,
    };
  }

  async unfollow(username: string, userId: number): Promise<ProfileType> {
    const followingUser = await this.findByUsername(username);

    if (followingUser.id === userId) {
      throw new HttpException(
        "Follower and following can't be equal",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.profileRepository.delete({
      followerId: userId.toString(),
      followingId: followingUser.id.toString(),
    });

    return {
      ...followingUser,
      following: false,
    };
  }

  buildResponseType(response: ProfileType): ProfileResponseInterface {
    delete (response as { email?: string }).email;
    return {
      profile: response,
    };
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException('Profile does not exit!', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
