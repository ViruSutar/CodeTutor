import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CourseSection } from './CourseSection';

@Entity({name:'CourseVideos'})
export class CourseVideo {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    title!: string;

  @Column()
    length!: number;

  @Column()
    sectionId!: number;

  @Column()
    url!: string;

  @ManyToOne(() => CourseSection)
    @JoinColumn({ name: 'sectionId' })
    section!: CourseSection;
}
