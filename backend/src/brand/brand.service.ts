import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

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
      length: brands.length,
      data: brands,
    };
  }

  private validateId(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid brand ID');
  }

  private async getBrandById(id: string) {
    this.validateId(id);
    const brand = await this.brandModel.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async findOne(id: string) {
    const brand = await this.getBrandById(id);

    return {
      message: 'Brand fetched successfully',
      data: brand,
    };
  }

  async create(createBrandDto: CreateBrandDto) {
    const { name, image } = createBrandDto;

    const isExist = await this.brandModel.findOne({ name });

    if (isExist) throw new BadRequestException('Brand already exists');

    const brand = await this.brandModel.create({ name, image });

    return {
      message: 'Brand created successfully',
      data: brand,
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.getBrandById(id);

    const { name, image } = updateBrandDto;

    if (name) {
      const isExist = await this.brandModel.findOne({ name });
      if (isExist) throw new BadRequestException('Brand already exists');
    }

    brand.name = name || brand.name;
    brand.image = image || brand.image;

    await brand.save();

    return {
      message: 'Brand updated successfully',
      data: brand,
    };
  }

  async remove(id: string) {
    const brand = await this.getBrandById(id);

    await brand.deleteOne();

    return {
      message: 'Brand deleted successfully',
    };
  }
}
