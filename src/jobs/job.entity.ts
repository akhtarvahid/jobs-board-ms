import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
// import { Application } from '../applications/application.entity';
import { JobType } from './job-type.enum';
import { Application } from 'src/applications/application.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'enum', enum: JobType })
  type: JobType;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  isRemote: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMin: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMax: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.jobs)
  company: User;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}