import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @desc    Register user
   * @route   POST /api/v1/auth/sign-up
   * @access  Public
   */
  @Post('sign-up')
  register(@Body() registerDto: SignupDto) {
    return this.authService.register(registerDto);
  }

  /**
   * @desc    Login user
   * @route   POST /api/v1/auth/sign-in
   * @access  Public
   */
  @Post('sign-in')
  login(@Body() loginDto: SigninDto) {
    return this.authService.login(loginDto);
  }
}
