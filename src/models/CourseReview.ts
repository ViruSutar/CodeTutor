import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity({name:'CourseReviews'})
export class CourseReview {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    rating!: number;

  @Column()
    comment!: string;

  @ManyToOne(() => User)
    user!: User;

  @Column({ nullable: true })
    userName!: string;

  @ManyToOne(() => Course)
    course!: Course;
}
