import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
// import { Job } from '../jobs/job.entity';
// import { Application } from '../applications/application.entity';
import { UserRole } from './user-role.enum';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.JOB_SEEKER,
  })
  role: UserRole;

  @Column({ nullable: true })
  resumePath: string;

//   @OneToMany(() => Job, (job) => job.company)
//   jobs: Job[];

//   @OneToMany(() => Application, (application) => application.user)
//   applications: Application[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}