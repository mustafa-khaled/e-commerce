import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
      data: await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      }),
    };
  }

  async findAll() {
    return {
      status: 200,
      message: 'Users fetched successfully',
      data: await this.userModel.find(),
    };
  }

  private async findUser(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('User not found');
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOne(id: string) {
    const user = await this.findUser(id);

    return {
      status: 200,
      message: 'User fetched successfully',
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findUser(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
    }

    return {
      status: 200,
      message: 'User updated successfully',
      data: await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        returnDocument: 'after',
      }),
    };
  }

  async remove(id: string) {
    await this.findUser(id);
    await this.userModel.findByIdAndDelete(id);

    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
}
