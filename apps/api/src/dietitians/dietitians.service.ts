import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dietitian } from './entities/dietitian.entity';
import { DietitianProfileData, CreateDietitianDto, UserRole } from '@diet/shared-types';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DietitiansService {
  constructor(
    @InjectRepository(Dietitian)
    private dietitiansRepository: Repository<Dietitian>,
    private usersService: UsersService,
  ) {}

  async createWithUser(createDietitianDto: CreateDietitianDto, tenantId?: string): Promise<Dietitian> {
    const { profile, ...userData } = createDietitianDto;
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
      role: UserRole.DIETITIAN,
      tenantId,
    });

    return this.create(user, profile);
  }

  async create(user: User, profileData: DietitianProfileData): Promise<Dietitian> {
    const dietitian = this.dietitiansRepository.create({
      ...profileData,
      user,
    });
    return this.dietitiansRepository.save(dietitian);
  }

  async findOneByUserId(userId: string): Promise<Dietitian | null> {
    return this.dietitiansRepository.findOne({ where: { userId } });
  }

  async update(userId: string, updateData: Partial<DietitianProfileData>): Promise<Dietitian> {
    await this.dietitiansRepository.update({ userId }, updateData);
    const updatedProfile = await this.findOneByUserId(userId);
    if (!updatedProfile) {
      throw new NotFoundException('Dietitian profile not found');
    }
    return updatedProfile;
  }
}
