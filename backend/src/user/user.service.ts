import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isExist) throw new HttpException('User already exists', 400);

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    return {
      status: 200,
      message: 'User created successfully',
      data: this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      }),
    };
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
