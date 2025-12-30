import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { DietitianProfileData } from '../index';

export class UpdateDietitianProfileDto implements Partial<DietitianProfileData> {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  bio?: string;
}
