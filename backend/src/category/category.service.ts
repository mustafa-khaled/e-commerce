import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { escapeRegex } from '@/common/utils/escape-regex.util';
import { findDocumentById } from '@/common/utils/find-by-id.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async findAll() {
    const categories = await this.categoryModel.find();

    return {
      message: 'Categories fetched successfully',
      results: categories.length,
      data: categories,
    };
  }

  async findOne(id: string) {
    const category = await findDocumentById(this.categoryModel, id, 'Category');

    return {
      message: 'Category fetched successfully',
      data: category,
    };
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({
      name: {
        $regex: `^${escapeRegex(createCategoryDto.name)}$`,
        $options: 'i',
      },
    });

    if (category) throw new BadRequestException('Category already exists');

    const newCategory = await this.categoryModel.create(createCategoryDto);
    return {
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.name) {
      const isExist = await this.categoryModel.findOne({
        name: {
          $regex: `^${escapeRegex(updateCategoryDto.name)}$`,
          $options: 'i',
        },
        _id: { $ne: id },
      });
      if (isExist) throw new BadRequestException('Category already exists');
    }

    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );

    if (!category) {
      // Still need this because findByIdAndUpdate won't validate ID before or throw on null
      throw new BadRequestException('Category not found or invalid ID');
    }

    return {
      message: 'Category updated successfully',
      data: category,
    };
  }

  async remove(id: string) {
    const category = await findDocumentById(this.categoryModel, id, 'Category');

    await category.deleteOne();

    return {
      message: 'Category deleted successfully',
    };
  }
}
