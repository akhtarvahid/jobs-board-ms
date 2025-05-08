import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './job.entity';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), UsersModule],
  providers: [JobsService, JwtService],
  controllers: [JobsController],
  exports: [JobsService]
})
export class JobsModule {}
