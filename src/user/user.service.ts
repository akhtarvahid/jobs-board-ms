import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BuildUserInterface } from './types/buildUserInterface.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async generateToken(user: UserEntity) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      }),
    };
  }
  async buildUserResponse(userResponse: UserEntity): Promise<BuildUserInterface> {
    return {
      user: {
        ...userResponse,
        token: await this.generateToken(userResponse),
      },
    };
  }
}
