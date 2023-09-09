import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity({name:'purchase_details'})
export class PurchaseDetail {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ nullable: true })
    userId!: number;

  @Column({ nullable: true })
    purchaseType!: number;

  @Column({ nullable: true })
    courseId!: number;

  @Column({ nullable: true })
    expiryDate!: Date;

  @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

  @ManyToOne(() => Course)
    @JoinColumn({ name: 'courseId' })
    course!: Course;
}
