import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
}
