import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@diet/shared-types';

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() tenantData: Partial<Tenant>) {
    return this.tenantsService.create(tenantData);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAll() {
    return this.tenantsService.findAll();
  }
}
