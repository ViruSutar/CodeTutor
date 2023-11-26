import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity({name:'PurchaseDetails'})
export class PurchaseDetail {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    userId!: number;

  @Column()
    purchaseType!: number;

  @Column()
    courseId!: number;

  @Column()
    expiryDate!: Date;

  @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

  @ManyToOne(() => Course)
    @JoinColumn({ name: 'courseId' })
    course!: Course;
}
