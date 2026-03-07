import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @Length(3, 30, { message: 'Name must be 3-30 characters long' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20, { message: 'Password must be 8-20 characters long' })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Verification code must be 6 characters' })
  verificationCode?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
