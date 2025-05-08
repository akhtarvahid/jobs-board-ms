import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    await this.findUserByEmailOrUsername(createUserDto.email, 'email');
    await this.findUserByEmailOrUsername(createUserDto.username, 'username');

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findUserByEmailOrUsername(text: string, type: string) {
    let userExist;
    if (type === 'username') {
      userExist = await this.userRepository.findOne({
        where: {
          username: text,
        },
      });
    }
    if (type === 'email') {
      userExist = await this.userRepository.findOne({
        where: {
          email: text,
        },
      });
    }
    if (userExist) {
      throw new HttpException(
        'Email or username already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return userExist;
  }
}
