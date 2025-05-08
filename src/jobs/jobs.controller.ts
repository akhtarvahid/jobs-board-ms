import { Controller, Get, Post, Body, Param, Put, Delete, Query, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { Request } from 'express';
import { User } from 'src/users/user.decorator';
import { User as UserEntity } from 'src/users/user.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() filterDto: JobFilterDto) {
    return this.jobsService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  async create(@Body() createJobDto: CreateJobDto, @Req() req: Request & { user: UserEntity }) {
    return this.jobsService.create(createJobDto, req.user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User('id') userId: string,
  ) {
    return this.jobsService.update(id, updateJobDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User('id') userId: string) {
    return this.jobsService.remove(id, userId);
  }

  @Get('company/my-jobs')
  async findCompanyJobs(@User('id') userId: string) {
    return this.jobsService.findCompanyJobs(userId);
  }
}