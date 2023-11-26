import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({name:'Courses'})
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  goals!: string;

  @Column()
  price!: number;

  @Column()
  hours!: number;

  @Column()
  subTitle!: string;

  @Column()
  description!: string;

  @Column()
  creatorId!: number;

  @Column()
  studentsCount!: number;

  @Column()
  creatorDetails!: string;

  @Column({ nullable: true })
  thumbnail!: string;

  @Column({ nullable: true })
  introVideo!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator!: User;
}
