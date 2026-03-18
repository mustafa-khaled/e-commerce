import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-category.schema';
import { isValidObjectId, Model } from 'mongoose';
import { escapeRegex } from '@/common/utils/escape-regex.util';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
  ) {}

  private validateId(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid sub-category ID');
  }

  private async getSubCategoryById(id: string) {
    this.validateId(id);
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) throw new NotFoundException('Sub-category not found');
    return subCategory;
  }

  async findAll() {
    const subCategories = await this.subCategoryModel.find();

    return {
      message: 'Sub-categories fetched successfully',
      length: subCategories.length,
      data: subCategories,
    };
  }

  async findOne(id: string) {
    const subCategory = await this.getSubCategoryById(id);

    return {
      message: 'Sub-category fetched successfully',
      data: subCategory,
    };
  }

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({
      name: {
        $regex: `^${escapeRegex(createSubCategoryDto.name)}$`,
        $options: 'i',
      },
    });

    if (subCategory)
      throw new BadRequestException('Sub-category already exists');

    const newSubCategory =
      await this.subCategoryModel.create(createSubCategoryDto);

    return {
      message: 'Sub-category created successfully',
      data: newSubCategory,
    };
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    this.validateId(id);

    const subCategory = await this.subCategoryModel.findByIdAndUpdate(
      id,
      updateSubCategoryDto,
      { new: true },
    );

    if (!subCategory) throw new NotFoundException('Sub-category not found');

    return {
      message: 'Sub-category updated successfully',
      data: subCategory,
    };
  }

  async remove(id: string) {
    this.validateId(id);

    const subCategory = await this.subCategoryModel.findByIdAndDelete(id);

    if (!subCategory) throw new NotFoundException('Sub-category not found');

    return {
      message: 'Sub-category deleted successfully',
    };
  }
}
