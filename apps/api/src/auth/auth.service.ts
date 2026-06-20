import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  SigninDto,
  SignupDto,
  VerifyEmailAndCode,
  VerifyEmailDto,
} from './dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/user/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express';
import { createHash } from 'crypto';
import { RefreshToken, RefreshTokenDocument } from './refresh-token.schema';
import { clearAuthCookies, setAuthCookies } from './auth-cookie.util';
import { UserService } from '@/user/user.service';

const saltOrRounds = 10;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: SignupDto, res: Response) {
    const isExist = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (isExist) throw new HttpException('User already exists', 400);

    const password = await this.hashPassword(registerDto.password);
    const user = new this.userModel({ ...registerDto, password });
    await user.save();

    const tokens = await this.issueTokens(user._id.toString(), user.email, user.role);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    user.password = undefined as never;
    return {
      status: 201,
      message: 'User registered successfully',
      data: user,
    };
  }

  async login(loginDto: SigninDto, res: Response) {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException();

    const tokens = await this.issueTokens(user._id.toString(), user.email, user.role);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    user.password = undefined as never;
    return {
      status: 200,
      message: 'User logged in successfully',
      data: user,
    };
  }

  async logout(refreshToken: string | undefined, res: Response) {
    if (refreshToken) {
      const hash = this.hashToken(refreshToken);
      await this.refreshTokenModel.updateOne({ tokenHash: hash }, { revoked: true });
    }
    clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }

  async refresh(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    let payload: { _id: string; email: string; role: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const hash = this.hashToken(refreshToken);
    const stored = await this.refreshTokenModel.findOne({
      tokenHash: hash,
      userId: payload._id,
      revoked: false,
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    await stored.updateOne({ revoked: true });

    const tokens = await this.issueTokens(payload._id, payload.email, payload.role as never);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return { message: 'Token refreshed successfully' };
  }

  async getMe(userId: string) {
    return this.userService.getMe(userId);
  }

  async resetPassword({ email }: VerifyEmailDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await this.userModel.findOneAndUpdate({ email }, { verificationCode: code });
    this.sendMail(code, email);

    return {
      status: 200,
      message: 'Verification code sent to your email successfully',
    };
  }

  async verifyCode({ code, email }: VerifyEmailAndCode) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (user.verificationCode !== String(code))
      throw new UnauthorizedException('Invalid code');

    user.verificationCode = undefined as never;
    user.passwordResetVerifiedAt = new Date();
    await user.save();

    return { status: 200, message: 'User verified successfully' };
  }

  async changePassword({ email, password }: SigninDto) {
    const user = await this.userModel
      .findOne({ email })
      .select('+passwordResetVerifiedAt');
    if (!user) throw new NotFoundException('User not found');

    const verifiedAt = user.passwordResetVerifiedAt;
    if (
      !verifiedAt ||
      Date.now() - verifiedAt.getTime() > 15 * 60 * 1000
    ) {
      throw new UnauthorizedException('Password reset verification expired');
    }

    user.password = await this.hashPassword(password);
    user.passwordResetVerifiedAt = undefined as never;
    await user.save();

    return { status: 200, message: 'User password changed successfully' };
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthTokens> {
    const payload = { _id: userId, email, role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenModel.create({
      userId,
      tokenHash: this.hashToken(refreshToken),
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, saltOrRounds);
  }

  private sendMail(code: string, email: string) {
    const htmlMessage = `
    <div>
      <h1>Forgot your password?</h1>
      <p>If you didn't forget your password, please ignore this email!</p>
      <p>Your verification code is: <h3 style="color: red; font-weight: bold">${code}</h3></p>
      <h6 style="font-weight: bold">E-commerce</h6>
    </div>
    `;

    this.mailService.sendMail({
      from: `E-commerce <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `E-commerce - Reset password`,
      html: htmlMessage,
    });
  }
}
