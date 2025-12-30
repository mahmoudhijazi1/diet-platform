import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { DietitiansService } from './dietitians.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, CreateDietitianProfileDto, UpdateDietitianProfileDto, CreateDietitianDto } from '@diet/shared-types';
import { User } from '../users/entities/user.entity';

@Controller('dietitians')
export class DietitiansController {
  constructor(private readonly dietitiansService: DietitiansService) {}

  @Auth(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  create(@CurrentUser() user: User, @Body() createDietitianDto: CreateDietitianDto) {
    // If Super Admin, they can create for any tenant (maybe pass in DTO), but for now let's assume
    // they create for their own tenant OR if they are Super Admin they might be creating for a specific tenant.
    // For simplicity, we use the current user's tenantId, unless it's Super Admin who might not have one?
    // Actually, Super Admin creates Tenant, then creates Dietitian FOR that Tenant.
    // So Super Admin probably needs to pass tenantId in the DTO or URL.
    // But let's stick to the simple case: Admin creates Dietitian for their own Tenant.
    return this.dietitiansService.createWithUser(createDietitianDto, user.tenantId);
  }

  @Auth(UserRole.DIETITIAN)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return this.dietitiansService.findOneByUserId(user.id);
  }

  @Auth(UserRole.DIETITIAN)
  @Put('profile')
  updateProfile(@CurrentUser() user: User, @Body() profileData: UpdateDietitianProfileDto) {
    return this.dietitiansService.update(user.id, profileData);
  }
}
