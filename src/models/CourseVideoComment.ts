import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({name:'CourseVideoComments'})
export class CourseVideoComment {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    comment!: string;

  @ManyToOne(() => User)
    user!: User;

  @Column()
    userName!: string;
}
