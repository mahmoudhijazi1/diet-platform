import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, CreateDietitianDto } from '@diet/shared-types';

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

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() tenantData: Partial<Tenant>) {
    return this.tenantsService.update(id, tenantData);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  @Get(':id/dietitians')
  @Roles(UserRole.SUPER_ADMIN)
  getDietitians(@Param('id') id: string) {
    return this.tenantsService.getDietitians(id);
  }

  @Post(':id/dietitians')
  @Roles(UserRole.SUPER_ADMIN)
  addDietitian(@Param('id') id: string, @Body() createDietitianDto: CreateDietitianDto) {
    return this.tenantsService.addDietitian(id, createDietitianDto);
  }

  @Delete(':id/dietitians/:userId')
  @Roles(UserRole.SUPER_ADMIN)
  removeDietitian(@Param('id') id: string, @Param('userId') userId: string) {
    return this.tenantsService.removeDietitian(id, userId);
  }
}
