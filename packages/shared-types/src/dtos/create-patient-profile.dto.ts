import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { PatientProfileData } from '../index';

export class CreatePatientProfileDto implements PatientProfileData {
  @IsDateString()
  dateOfBirth: Date;

  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender: 'MALE' | 'FEMALE' | 'OTHER';

  @IsNumber()
  @Min(0)
  height: number;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  initialWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  goalWeight?: number;

  @IsOptional()
  @IsString()
  activityLevel?: string;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  dietaryPreferences?: string;
}
