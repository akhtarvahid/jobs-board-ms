import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ProfileResponseInterface,
  ProfileType,
} from './types/profileResponse.type';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly profileRepository: Repository<UserEntity>,
  ) {}

  async getProfile(username: string, userId: number): Promise<ProfileType> {
    const user = await this.profileRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException('Profile does not exit!', HttpStatus.NOT_FOUND);
    }
    return {
        ...user,
        following: false,
    };
  }

  buildResponseType(response: ProfileType): ProfileResponseInterface {
    delete (response as { email?: string }).email;
    return {
      profile: response
    };
  }
}
