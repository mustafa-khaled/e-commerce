import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninDto, SignupDto } from './dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
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

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async generateToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
