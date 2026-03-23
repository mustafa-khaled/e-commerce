import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  findDocumentById,
  validateObjectId,
} from '@/common/utils/find-by-id.util';
import { escapeRegex } from '@/common/utils/escape-regex.util';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<Brand>,
  ) {}

  async findAll() {
    const brands = await this.brandModel.find();

    return {
      message: 'Brands fetched successfully',
      results: brands.length,
      data: brands,
    };
  }

  async findOne(id: string) {
    const brand = await findDocumentById(this.brandModel, id, 'Brand');

    return {
      message: 'Brand fetched successfully',
      data: brand,
    };
  }

  async create(createBrandDto: CreateBrandDto) {
    const isExist = await this.brandModel.findOne({
      name: { $regex: `^${escapeRegex(createBrandDto.name)}$`, $options: 'i' },
    });

    if (isExist) throw new BadRequestException('Brand already exists');

    const brand = await this.brandModel.create(createBrandDto);

    return {
      message: 'Brand created successfully',
      data: brand,
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await findDocumentById(this.brandModel, id, 'Brand');

    if (updateBrandDto.name) {
      const isExist = await this.brandModel.findOne({
        name: {
          $regex: `^${escapeRegex(updateBrandDto.name)}$`,
          $options: 'i',
        },
        _id: { $ne: id },
      });
      if (isExist) throw new BadRequestException('Brand already exists');
    }

    brand.name = updateBrandDto.name ?? brand.name;
    brand.image = updateBrandDto.image ?? brand.image;

    await brand.save();

    return {
      message: 'Brand updated successfully',
      data: brand,
    };
  }

  async remove(id: string) {
    const brand = await findDocumentById(this.brandModel, id, 'Brand');

    await brand.deleteOne();

    return {
      message: 'Brand deleted successfully',
    };
  }
}
