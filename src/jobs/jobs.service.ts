import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { User } from '../users/user.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, company: User): Promise<Job> {
    const job = this.jobRepository.create({
      ...createJobDto,
      company,
    });
    return this.jobRepository.save(job);
  }

  async findAll(filterDto: JobFilterDto): Promise<Job[]> {
    const { type, isRemote, salaryMin, salaryMax, search } = filterDto;
    const where: any = { isActive: true };

    if (type) where.type = type;
    if (isRemote !== undefined) where.isRemote = isRemote;
    if (salaryMin !== undefined || salaryMax !== undefined) {
      where.salaryMin = Between(salaryMin || 0, salaryMax || 9999999);
    }
    if (search) {
      where.title = Like(`%${search}%`);
    }

    return this.jobRepository.find({ where, relations: ['company'] });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ 
      where: { id },
      relations: ['company', 'applications'],
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto, userId: string): Promise<Job> {
    const job = await this.findOne(id);
    if (job.company.id !== userId) {
      throw new ForbiddenException('You can only update your own jobs');
    }
    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async remove(id: string, userId: string): Promise<void> {
    const job = await this.findOne(id);
    if (job.company.id !== userId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }
    await this.jobRepository.remove(job);
  }

  async findCompanyJobs(companyId: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { company: { id: companyId } },
      relations: ['applications'],
    });
  }
}