import { IsString, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDietitianProfileDto } from './create-dietitian-profile.dto';

export class CreateDietitianDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @ValidateNested()
  @Type(() => CreateDietitianProfileDto)
  profile: CreateDietitianProfileDto;
}
