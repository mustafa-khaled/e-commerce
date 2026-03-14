import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@/user/guard/auth.guard';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { QueryUserDto } from '@/user/dto/query-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @desc    Create a new user
   * @route   POST /api/v1/users
   * @access  Private (Admin)
   */
  @Post()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * @desc    Get all users
   * @route   GET /api/v1/users
   * @access  Private (Admin)
   */
  @Get()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard)
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  /**
   * @desc    Get user by ID
   * @route   GET /api/v1/users/:id
   * @access  Private (Admin)
   */
  @Get(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * @desc    Update user
   * @route   PATCH /api/v1/users/:id
   * @access  Private (Admin)
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * @desc    Delete user
   * @route   DELETE /api/v1/users/:id
   * @access  Private (Admin)
   */
  @Delete(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

@Controller('user/me')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  // For User
  /**
   * @desc    Get current user
   * @route   GET /api/v1/users/me
   * @access  Private (User, Admin)
   */
  @Get()
  @UseGuards(AuthGuard)
  @Roles([UserRole.ADMIN, UserRole.USER])
  getMe(@Req() req) {
    return this.userService.getMe(req.user._id);
  }

  /**
   * @desc    Update current user
   * @route   PATCH /api/v1/users/me
   * @access  Private (User, Admin)
   */
  @Patch()
  @UseGuards(AuthGuard)
  @Roles([UserRole.ADMIN, UserRole.USER])
  updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateMe(req.user._id, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @Roles([UserRole.USER])
  deleteMe(@Req() req) {
    return this.userService.deleteMe(req.user._id);
  }
}
