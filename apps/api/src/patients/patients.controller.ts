import { Controller, Get, Post, Body, Put, Param, Delete, Patch } from '@nestjs/common';
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

  @Auth(UserRole.DIETITIAN)
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.patientsService.findAllByTenant(user.tenantId);
  }

  @Auth(UserRole.DIETITIAN)
  @Get(':idOrUsername')
  findOne(@Param('idOrUsername') idOrUsername: string, @CurrentUser() user: User) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUsername);
    if (isUuid) {
      return this.patientsService.findOne(idOrUsername, user.tenantId);
    }
    return this.patientsService.findOneByUsername(idOrUsername, user.tenantId);
  }

  @Auth(UserRole.DIETITIAN)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.patientsService.remove(id, user.tenantId);
  }

  @Auth(UserRole.DIETITIAN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreatePatientDto>, @CurrentUser() user: User) {
    return this.patientsService.updateFullPatient(id, updateData, user.tenantId);
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
