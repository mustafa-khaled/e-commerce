import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SigninDto,
  SignupDto,
  VerifyEmailAndCode,
  VerifyEmailDto,
} from './dtos/auth.dto';
import { REFRESH_COOKIE } from './auth-cookie.util';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/request.decorators';
import { AuthUser } from '@/common/interfaces/auth-user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  register(@Body() registerDto: SignupDto, @Res({ passthrough: true }) res) {
    return this.authService.register(registerDto, res);
  }

  @Post('sign-in')
  login(@Body() loginDto: SigninDto, @Res({ passthrough: true }) res) {
    return this.authService.login(loginDto, res);
  }

  @Post('logout')
  logout(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.logout(req.cookies?.[REFRESH_COOKIE], res);
  }

  @Post('refresh')
  refresh(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.refresh(req.cookies?.[REFRESH_COOKIE], res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@CurrentUser() user: AuthUser) {
    return this.authService.getMe(user._id);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: VerifyEmailDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-code')
  verifyCode(@Body() verifyCodeDto: VerifyEmailAndCode) {
    return this.authService.verifyCode(verifyCodeDto);
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: SigninDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
