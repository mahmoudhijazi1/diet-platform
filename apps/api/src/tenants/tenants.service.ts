import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) {}

  async create(tenantData: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantsRepository.create(tenantData);
    return this.tenantsRepository.save(tenant);
  }
}
