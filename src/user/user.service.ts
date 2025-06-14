import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BuildUserInterface } from './types/buildUserInterface.type';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

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
    const errorResponse = {
      errors: {},
    };
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'email', 'bio', 'image', 'username', 'password'], // need to pass manually because by default password({select: false}) in user.entity.ts
    });

    if (!user) {
      errorResponse.errors['email'] = 'email is invalid';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    //compare password whether matches or not
    if (!user || !(await user.comparePassword(loginUserDto.password))) {
      errorResponse.errors['password'] = 'password is invalid';

      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    //delete password from response for security
    delete (user as { password?: string }).password;

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'email', 'bio', 'image', 'username'],
    });

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUser(
    user: UserEntity,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const newUser = {
      ...user,
      ...updateUserDto,
    };
    if (!updateUserDto)
      throw new HttpException(
        'Request body is required',
        HttpStatus.BAD_REQUEST,
      );
    return this.userRepository.save(newUser);
  }

  async findUserByEmailOrUsername(text: string, type?: string) {
    const errorResponse = {
      errors: {},
    };
    let userExist;
    if (type === 'username') {
      userExist = await this.userRepository.findOne({
        where: {
          username: text,
        },
      });
      if (userExist) {
        errorResponse.errors['username'] = 'username already been taken!';
      }
    }
    if (type === 'email') {
      userExist = await this.userRepository.findOne({
        where: {
          email: text,
        },
      });
      if (userExist) {
        errorResponse.errors['email'] = 'email already been taken!';
      }
    }
    if (userExist) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
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
