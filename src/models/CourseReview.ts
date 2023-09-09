import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity({name:'course_reviews'})
export class CourseReview {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ nullable: true })
    rating!: number;

  @Column({ nullable: true })
    comment!: string;

  @ManyToOne(() => User)
    user!: User;

  @Column({ nullable: true })
    userName!: string;

  @ManyToOne(() => Course)
    course!: Course;
}
