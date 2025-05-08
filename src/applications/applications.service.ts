import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { User } from '../users/user.entity';
import { JobsService } from '../jobs/jobs.service';
import { UserRole } from 'src/users/user-role.enum';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private jobsService: JobsService,
  ) {}

  async create(
    jobId: string,
    createApplicationDto: CreateApplicationDto,
    user: User,
  ): Promise<Application> {
    const job = await this.jobsService.findOne(jobId);

    // // Check if user already applied
    // const existingApplication = await this.applicationRepository.findOne({
    //   where: { user: { id: user.id }, job: { id: jobId } },
    // });

    // if (existingApplication) {
    //   throw new ForbiddenException('You have already applied to this job');
    // }

    const application = this.applicationRepository.create({
      ...createApplicationDto,
      user,
      job,
    });

    return this.applicationRepository.save(application);
  }

  async findAllForUser(userId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { user: { id: userId } },
      relations: ['job', 'job.company'],
    });
  }

  async findAllForJob(
    jobId: string,
    companyId: string,
  ): Promise<Application[]> {
    const job = await this.jobsService.findOne(jobId);

    if (job.company.id !== companyId) {
      throw new ForbiddenException(
        'You can only view applications for your own jobs',
      );
    }

    return this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['user'],
    });
  }

  async findOne(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['user', 'job', 'job.company'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (
      userRole !== UserRole.ADMIN &&
      application.user.id !== userId &&
      application.job.company.id !== userId
    ) {
      throw new ForbiddenException(
        'You are not authorized to view this application',
      );
    }

    return application;
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
    userId: string,
  ): Promise<Application> {
    const application = await this.findOne(id, userId, UserRole.COMPANY);

    if (application.job.company.id !== userId) {
      throw new ForbiddenException(
        'You can only update applications for your own jobs',
      );
    }

    Object.assign(application, updateApplicationDto);
    return this.applicationRepository.save(application);
  }

  async remove(id: string, userId: string): Promise<void> {
    const application = await this.findOne(id, userId, UserRole.JOB_SEEKER);

    if (application.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own applications');
    }

    await this.applicationRepository.remove(application);
  }
}
