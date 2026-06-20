import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

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

    const hashedPassword = await this.hashPassword(createUserDto.password);
    return {
      message: 'User created successfully',
      data: await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      }),
    };
  }

  async findAll(query: QueryUserDto) {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      sortOrder = 'desc',
      name,
      email,
      role,
    } = query;

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ [sort]: sortOrder === 'asc' ? 1 : -1 })
        .exec(),

      this.userModel.countDocuments(filter),
    ]);

    return {
      message: 'Users fetched successfully',
      data: users,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.findUser(id);

    return {
      message: 'User fetched successfully',
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findUser(id);

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    return {
      message: 'User updated successfully',
      data: await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      }),
    };
  }

  async remove(id: string) {
    await this.findUser(id);
    await this.userModel.findByIdAndDelete(id);

    return {
      message: 'User deleted successfully',
    };
  }

  private async findUser(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('User not found');
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, saltOrRounds);
  }

  // ===================== For user =====================

  async getMe(id: string) {
    const user = await this.findUser(id);

    return {
      message: 'User fetched successfully',
      data: user,
    };
  }

  async updateMe(id: string, updateUserDto: UpdateUserDto) {
    await this.findUser(id);

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    return {
      message: 'User updated successfully',
      data: await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      }),
    };
  }

  async deleteMe(id: string) {
    await this.findUser(id);
    await this.userModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );

    return {
      message: 'User deleted successfully',
    };
  }
}
