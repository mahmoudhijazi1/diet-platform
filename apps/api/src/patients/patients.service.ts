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

  async findAllByTenant(tenantId: string): Promise<Patient[]> {
    return this.patientsRepository.find({
      where: { user: { tenantId } },
      relations: ['user'],
    });
  }

  async findOne(id: string, tenantId?: string): Promise<Patient> {
    const where: any = { id };
    if (tenantId) {
      where.user = { tenantId };
    }

    const patient = await this.patientsRepository.findOne({
      where,
      relations: ['user'],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async findOneByUsername(username: string, tenantId?: string): Promise<Patient> {
    const where: any = { user: { username } };
    if (tenantId) {
      where.user.tenantId = tenantId;
    }

    const patient = await this.patientsRepository.findOne({
      where,
      relations: ['user'],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with username ${username} not found`);
    }
    return patient;
  }

  async remove(id: string, tenantId?: string): Promise<void> {
    const patient = await this.findOne(id, tenantId);
    // Delete the user account associated with the patient
    // This will cascade delete the patient profile due to the relation
    await this.usersService.remove(patient.userId);
  }

  async updateFullPatient(id: string, updateData: Partial<CreatePatientDto>, tenantId?: string): Promise<Patient> {
    const patient = await this.findOne(id, tenantId);
    
    const { profile, ...userData } = updateData;
    
    if (Object.keys(userData).length > 0) {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      await this.usersService.update(patient.userId, userData as any);
    }

    if (profile) {
      await this.patientsRepository.update({ id }, profile);
    }

    return this.findOne(id, tenantId);
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
