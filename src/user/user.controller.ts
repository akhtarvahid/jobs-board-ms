import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { BuildUserInterface } from './types/buildUserInterface.type';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GlobalValidationPipe } from '@app/shared/pipes/global-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<BuildUserInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<BuildUserInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<BuildUserInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('current-user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User() user: UserEntity,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<BuildUserInterface> {
    const updatedUser = await this.userService.updateUser(user, updateUserDto);
    return this.userService.buildUserResponse(updatedUser);
  }
}
