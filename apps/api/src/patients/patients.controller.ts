import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, CreatePatientDto, UpdatePatientProfileDto } from '@diet/shared-types';
import { User } from '../users/entities/user.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Auth(UserRole.DIETITIAN)
  @Post()
  create(@CurrentUser() user: User, @Body() createPatientDto: CreatePatientDto) {
    // Dietitian creates patient for their own tenant
    return this.patientsService.createWithUser(createPatientDto, user.tenantId);
  }

  @Auth(UserRole.PATIENT)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return this.patientsService.findOneByUserId(user.id);
  }

  @Auth(UserRole.PATIENT)
  @Put('profile')
  updateProfile(@CurrentUser() user: User, @Body() profileData: UpdatePatientProfileDto) {
    return this.patientsService.update(user.id, profileData);
  }
}
