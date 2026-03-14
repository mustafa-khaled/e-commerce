import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDto {
  @IsString()
  @Length(3, 30, { message: 'Name must be 3-30 characters long' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20, { message: 'Password must be 8-20 characters long' })
  password: string;
}

export class SigninDto extends PickType(SignupDto, [
  'email',
  'password',
] as const) {}


export class VerifyEmailDto extends PickType(SignupDto, ['email'] as const) {}
