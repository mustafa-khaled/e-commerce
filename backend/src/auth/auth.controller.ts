import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SigninDto,
  SignupDto,
  VerifyEmailDto,
} from './dtos/auth.dto';

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

  /**
   * @desc    Reset user password
   * @route   POST /api/v1/auth/reset-password
   * @access  Public
   */
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: VerifyEmailDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * @desc    Verify user email
   * @route   POST /api/v1/auth/verify-email
   * @access  Public
   */

  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  /**
   * @desc    Resend verification email
   * @route   POST /api/v1/auth/resend-verification-email
   * @access  Public
   */
  @Post('resend-verification-email')
  resendVerificationEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.resendVerificationEmail(verifyEmailDto);
  }
}
