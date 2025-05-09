import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BuildUserInterface } from './types/buildUserInterface.type';
import { LoginUserDto } from './dto/loginUser.dto';

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
    const user = await this.userRepository.save(newUser);

    //delete password from response for security
    delete (user as { password?: string }).password;

    return user;
  }
  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'email', 'password'], // need to pass manually because by default password({select: false}) in user.entity.ts
    });

    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //compare password whether matches or not
    if (!user || !(await user.comparePassword(loginUserDto.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    //delete password from response for security
    delete (user as { password?: string }).password;

    return user;
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
  async buildUserResponse(
    userResponse: UserEntity,
  ): Promise<BuildUserInterface> {
    return {
      user: {
        ...userResponse,
        token: await this.generateToken(userResponse),
      },
    };
  }
}
