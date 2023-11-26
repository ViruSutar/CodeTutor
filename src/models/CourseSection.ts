import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './Course';

@Entity({name:'CourseSections'})
export class CourseSection {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    sectionName!: string;

  @ManyToOne(() => Course, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn({ name: 'courseId' })
    course!: Course;
}
