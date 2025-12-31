import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { DietitiansService } from '../dietitians/dietitians.service';
import { CreateDietitianDto, UserRole } from '@diet/shared-types';
import { UsersService } from '../users/users.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    private dietitiansService: DietitiansService,
    private usersService: UsersService,
  ) {}

  async create(tenantData: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantsRepository.create(tenantData);
    return this.tenantsRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find();
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: string, tenantData: Partial<Tenant>): Promise<Tenant> {
    await this.tenantsRepository.update(id, tenantData);
    return this.tenantsRepository.findOneByOrFail({ id });
  }

  async remove(id: string): Promise<void> {
    await this.tenantsRepository.delete(id);
  }

  async addDietitian(tenantId: string, createDietitianDto: CreateDietitianDto) {
    const tenant = await this.findOne(tenantId);
    return this.dietitiansService.createWithUser(createDietitianDto, tenant.id);
  }

  async getDietitians(tenantId: string) {
    // We can use UsersService to find users with role DIETITIAN and tenantId
    // But UsersService doesn't have a findByTenantAndRole method.
    // We can use the repository directly if we inject it, or add a method to UsersService.
    // Since UsersService is injected, let's assume we can use it or we need to extend it.
    // For now, let's use the tenants repository to fetch users via relation.
    
    const tenant = await this.tenantsRepository.findOne({
      where: { id: tenantId },
      relations: ['users', 'users.dietitianProfile'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    return tenant.users.filter(user => user.role === UserRole.DIETITIAN);
  }

  async removeDietitian(tenantId: string, userId: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    if (user.tenantId !== tenantId) {
      throw new NotFoundException(`User does not belong to this tenant`);
    }
    
    if (user.role !== UserRole.DIETITIAN) {
      throw new NotFoundException(`User is not a dietitian`);
    }
    
    await this.usersService.remove(userId);
  }
}
