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
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}
  async register(registerDto: SignupDto) {
    const isExist = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (isExist) throw new HttpException('User already exists', 40);

    const password = await this.hashPassword(registerDto.password);
    const user = new this.userModel({ ...registerDto, password });
    user.save();

    const payload = { _id: user._id, email: user.email, role: user.role };
    const token = await this.generateToken(payload);

    return {
      status: 201,
      message: 'User registered successfully',
      data: user,
      access_token: token,
    };
  }

  async login(loginDto: SigninDto) {
    let user = await this.userModel
      .findOne({
        email: loginDto.email,
      })
      .select('+password');
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException();

    const payload = { _id: user._id, email: user.email, role: user.role };
    const token = await this.generateToken(payload);

    user.password = undefined as any;
    return {
      status: 200,
      message: 'User logged in successfully',
      data: user,
      access_token: token,
    };
  }

  async resetPassword({ email }: VerifyEmailDto) {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new NotFoundException('User not found');

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Save code to user
    await this.userModel.findOneAndUpdate(
      { email },
      {
        verificationCode: code,
      },
    );
    // Send code to user email
    this.sendMail(code, email);

    return {
      status: 200,
      message: 'Verification code sent to your email successfully',
    };
  }

  async verifyCode({ code, email }: VerifyEmailAndCode) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (user.verificationCode !== code)
      throw new UnauthorizedException('Invalid code');

    user.verificationCode = undefined as any;
    user.save();

    return {
      status: 200,
      message: 'User verified successfully',
    };
  }

  async changePassword({ email, password }: SigninDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    user.password = await this.hashPassword(password);
    user.save();

    return {
      status: 200,
      message: 'User password changed successfully',
    };
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async generateToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  private sendMail(code: number, email: string) {
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
