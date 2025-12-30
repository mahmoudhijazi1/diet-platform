import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PatientProfileData } from '@diet/shared-types';

@Entity('patients')
export class Patient implements PatientProfileData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: ['MALE', 'FEMALE', 'OTHER'],
  })
  gender: 'MALE' | 'FEMALE' | 'OTHER';

  @Column('float')
  height: number;

  @Column('float')
  weight: number;

  @Column('float', { nullable: true })
  initialWeight?: number;

  @Column('float', { nullable: true })
  goalWeight?: number;

  @Column({ nullable: true })
  activityLevel?: string;

  @Column({ nullable: true, type: 'text' })
  medicalConditions?: string;

  @Column({ nullable: true, type: 'text' })
  dietaryPreferences?: string;

  @OneToOne(() => User, (user) => user.patientProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
