import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(id: string, profileDto: UserProfileDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, profileDto);
    return this.userRepository.save(user);
  }

  async uploadResume(id: string, resumePath: string): Promise<User> {
    const user = await this.findOne(id);
    user.resumePath = resumePath;
    return this.userRepository.save(user);
  }
}