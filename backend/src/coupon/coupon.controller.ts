import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { AuthGuard } from '@/user/guard/auth.guard';

@Controller('coupon')
@Roles([UserRole.ADMIN])
@UseGuards(AuthGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}

