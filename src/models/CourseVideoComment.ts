import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class CourseVideoComment {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ nullable: true })
    comment!: string;

  @ManyToOne(() => User)
    user!: User;

  @Column({ nullable: true })
    userName!: string;
}