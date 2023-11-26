import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { CourseVideoComment } from './CourseVideoComment';

@Entity({name:'Replies'})
export class Reply {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    replyText!: string;

  @ManyToOne(() => User)
    user!: User;

  @Column()
    userName!: string;

  @ManyToOne(() => CourseVideoComment)
    comment: CourseVideoComment = new CourseVideoComment;
}
