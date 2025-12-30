import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { DietitianProfileData } from '../index';

export class CreateDietitianProfileDto implements DietitianProfileData {
  @IsString()
  specialization: string;

  @IsInt()
  @Min(0)
  yearsOfExperience: number;

  @IsOptional()
  @IsString()
  bio?: string;
}
