import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CourseSection } from './CourseSection';

@Entity({name:'course_videos'})
export class CourseVideo {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ nullable: true })
    title!: string;

  @Column({ nullable: true })
    length!: number;

  @Column({ nullable: true })
    sectionId!: number;

  @Column({ nullable: true })
    url!: string;

  @ManyToOne(() => CourseSection)
    @JoinColumn({ name: 'sectionId' })
    section!: CourseSection;
}
