import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DietitianProfileData } from '@diet/shared-types';

@Entity('dietitians')
export class Dietitian implements DietitianProfileData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  specialization: string;

  @Column()
  yearsOfExperience: number;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @OneToOne(() => User, (user) => user.dietitianProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
