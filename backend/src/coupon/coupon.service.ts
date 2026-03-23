import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponDocument } from './coupon.schema';
import { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';
import { escapeRegex } from '@/common/utils/escape-regex.util';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  async findAll() {
    const coupons = await this.couponModel.find();

    return {
      message: 'Coupons fetched successfully',
      results: coupons.length,
      data: coupons,
    };
  }

  async findOne(id: string) {
    const coupon = await findDocumentById(this.couponModel, id, 'Coupon');

    return {
      message: 'Coupon fetched successfully',
      data: coupon,
    };
  }

  async create(createCouponDto: CreateCouponDto) {
    const isExist = await this.couponModel.findOne({
      name: { $regex: `^${escapeRegex(createCouponDto.name)}$`, $options: 'i' },
    });

    if (isExist) throw new BadRequestException('Coupon already exists');

    const coupon = await this.couponModel.create(createCouponDto);

    return {
      message: 'Coupon created successfully',
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await findDocumentById(this.couponModel, id, 'Coupon');

    if (updateCouponDto.name) {
      const isExist = await this.couponModel.findOne({
        name: {
          $regex: `^${escapeRegex(updateCouponDto.name)}$`,
          $options: 'i',
        },
        _id: { $ne: id },
      });
      if (isExist) throw new BadRequestException('Coupon already exists');
    }

    coupon.name = updateCouponDto.name ?? coupon.name;
    coupon.discount = updateCouponDto.discount ?? coupon.discount;
    coupon.expiryDate = updateCouponDto.expiryDate ?? coupon.expiryDate;

    await coupon.save();

    return {
      message: 'Coupon updated successfully',
      data: coupon,
    };
  }

  async remove(id: string) {
    const coupon = await findDocumentById(this.couponModel, id, 'Coupon');

    await coupon.deleteOne();

    return {
      message: 'Coupon deleted successfully',
    };
  }
}
