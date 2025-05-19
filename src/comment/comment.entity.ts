import { StoryEntity } from '@app/story/story.entity';
import { UserEntity } from '@app/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comment' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string;

  @ManyToOne(() => StoryEntity, (story) => story.comments, {
    onDelete: 'CASCADE', // Delete comments when story is deleted
  })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  owner: UserEntity;
}
