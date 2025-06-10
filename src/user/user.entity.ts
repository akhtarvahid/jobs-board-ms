import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, JoinTable, ManyToMany } from "typeorm"
import * as bcrypt from 'bcrypt';
import { StoryEntity } from "@app/story/story.entity";

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    username: string

    @Column({ default: '' })
    bio: string

    @Column({ default: '' })
    image: string

    @Column({ select: false })
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    @OneToMany(() => StoryEntity, (story) => story.owner)
    stories: StoryEntity[]

    @ManyToMany(() => StoryEntity)
    @JoinTable()
    favorites: StoryEntity[];
}
