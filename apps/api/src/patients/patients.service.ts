import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { PatientProfileData, CreatePatientDto, UserRole } from '@diet/shared-types';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private usersService: UsersService,
  ) {}

  async createWithUser(createPatientDto: CreatePatientDto, tenantId: string): Promise<Patient> {
    const { profile, ...userData } = createPatientDto;
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
      role: UserRole.PATIENT,
      tenantId,
    });

    return this.create(user, profile);
  }

  async create(user: User, profileData: PatientProfileData): Promise<Patient> {
    const patient = this.patientsRepository.create({
      ...profileData,
      user,
    });
    return this.patientsRepository.save(patient);
  }

  async findOneByUserId(userId: string): Promise<Patient | null> {
    return this.patientsRepository.findOne({ where: { userId } });
  }

  async update(userId: string, updateData: Partial<PatientProfileData>): Promise<Patient> {
    await this.patientsRepository.update({ userId }, updateData);
    const updatedProfile = await this.findOneByUserId(userId);
    if (!updatedProfile) {
      throw new NotFoundException('Patient profile not found');
    }
    return updatedProfile;
  }
}
