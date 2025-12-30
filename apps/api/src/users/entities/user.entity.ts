import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { UserRole, User as SharedUser } from '@diet/shared-types';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Dietitian } from '../../dietitians/entities/dietitian.entity';
import { Patient } from '../../patients/entities/patient.entity';

@Entity('users')
export class User implements SharedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ select: false })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { nullable: true })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToOne(() => Dietitian, (dietitian) => dietitian.user)
  dietitianProfile: Dietitian;

  @OneToOne(() => Patient, (patient) => patient.user)
  patientProfile: Patient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
