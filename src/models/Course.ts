import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({name:'Courses'})
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true })
  goals!: string;

  @Column({ nullable: true })
  price!: number;

  @Column({ nullable: true })
  hours!: number;

  @Column({ nullable: true })
  subTitle!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  creatorId!: number;

  @Column({ nullable: true })
  studentsCount!: number;

  @Column({ nullable: true })
  creatorDetails!: string;

  @Column({ nullable: true })
  thumbnail!: string;

  @Column({ nullable: true })
  introVideo!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator!: User;
}
