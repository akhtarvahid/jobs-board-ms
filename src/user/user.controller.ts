import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from './user.entity';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<{ user: UserEntity }> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<{ user: UserEntity }> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }
}
