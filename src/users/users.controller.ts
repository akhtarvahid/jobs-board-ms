import { Controller, Get, Put, Body, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from './user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@User('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Put('profile')
  async updateProfile(@User('id') userId: string, @Body() profileDto: UserProfileDto) {
    return this.usersService.updateProfile(userId, profileDto);
  }

  @Put('resume')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadResume(@User('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadResume(userId, file.path);
  }
}