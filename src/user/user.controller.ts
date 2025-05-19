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
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiSecurity,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User registration data',
    schema: {
      type: 'object',
      properties: {
        user: {
          $ref: '#/components/schemas/CreateUserDto',
        },
      },
      required: ['user'],
      example: {
        user: {
          username: 'john_doe',
          password: 'securePassword123!',
          email: 'john@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        user: {
          $ref: '#/components/schemas/BuildUserInterface', // Define this if you want response documentation
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error (e.g., invalid email)',
  })
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<BuildUserInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login existing user' })
  @ApiBody({
    description: 'User login credentials',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              example: 'securePassword123!',
            },
          },
          required: ['email', 'password'],
        },
      },
      example: {
        user: {
          email: 'john@example.com',
          password: 'securePassword123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            token: { type: 'string' },
            // Add other user fields you return
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiSecurity('public') // Disables auth requirement in Swagger UI
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<BuildUserInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('current-user')
  @ApiBearerAuth('JWT-auth') // Must match the security name in main.ts
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the profile of the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully returned user profile',
    schema: {
      example: {
        user: {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<BuildUserInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('current-user')
  @ApiBearerAuth('JWT-auth') // Requires valid JWT token
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Updates and returns the modified user profile',
  })
  @ApiBody({
    description: 'User data to update',
    schema: {
      type: 'object',
      properties: {
        user: {
          $ref: '#/components/schemas/UpdateUserDto',
        },
      },
      example: {
        user: {
          username: 'john_doe',
          bio: "It's beginning to build the world!",
          image: 'http://unsplash.com/hair-color.png',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 8 },
            email: { type: 'string', example: 'vahid@gmail.com' },
            username: { type: 'string', example: 'vahid-ak' },
            bio: {
              type: 'string',
              example: "It's beginning to build the world!",
            },
            image: {
              type: 'string',
              example: 'http://unsplash.com/hair-color.png',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @UseGuards(AuthGuard)
  async updateUser(
    @User() user: UserEntity,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<BuildUserInterface> {
    const updatedUser = await this.userService.updateUser(user, updateUserDto);
    return this.userService.buildUserResponse(updatedUser);
  }
}
