import { IsString, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePatientProfileDto } from './create-patient-profile.dto';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ValidateNested()
  @Type(() => CreatePatientProfileDto)
  profile: CreatePatientProfileDto;
}
