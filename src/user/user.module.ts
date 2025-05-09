import { Module } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { UserController } from '@app/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, JwtService, AuthGuard],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}