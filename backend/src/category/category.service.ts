import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { isValidObjectId, Model } from 'mongoose';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
      length: categories.length,
      data: categories,
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid category ID');
    const category = await this.categoryModel.findById(id);

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
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid category ID');

    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );

    if (!category) throw new NotFoundException('Category not found');

    return {
      message: 'Category updated successfully',
      data: category,
    };
  }

  async remove(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid category ID');

    const category = await this.categoryModel.findByIdAndDelete(id);

    if (!category) throw new NotFoundException('Category not found');

    return {
      message: 'Category deleted successfully',
    };
  }
}
