import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

import { Request } from 'express';
import { User } from 'src/users/user.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('job/:jobId')
  async create(
    @Param('jobId') jobId: string,
    @Body() createApplicationDto: CreateApplicationDto,
    @Req() req: Request & { user: User },
  ) {
    return this.applicationsService.create(
      jobId,
      createApplicationDto,
      req.user,
    );
  }

  @Get('my-applications')
  async findAllForUser(@Req() req: Request & { user: User }) {
    return this.applicationsService.findAllForUser(req.user.id);
  }

  @Get('job/:jobId')
  async findAllForJob(
    @Param('jobId') jobId: string,
    @Req() req: Request & { user: User },
  ) {
    return this.applicationsService.findAllForJob(jobId, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request & { user: User }) {
    return this.applicationsService.findOne(id, req.user.id, req.user.role);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Req() req: Request & { user: User },
  ) {
    return this.applicationsService.update(
      id,
      updateApplicationDto,
      req.user.id,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: User }) {
    return this.applicationsService.remove(id, req.user.id);
  }
}
