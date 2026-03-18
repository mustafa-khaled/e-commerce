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
import { escapeRegex } from '@/common/utils/escape-regex.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  private validateId(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid category ID');
  }

  private async getCategoryById(id: string) {
    this.validateId(id);
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findAll() {
    const categories = await this.categoryModel.find();

    return {
      message: 'Categories fetched successfully',
      length: categories.length,
      data: categories,
    };
  }

  async findOne(id: string) {
    const category = await this.getCategoryById(id);

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
    this.validateId(id);

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
    this.validateId(id);

    const category = await this.categoryModel.findByIdAndDelete(id);

    if (!category) throw new NotFoundException('Category not found');

    return {
      message: 'Category deleted successfully',
    };
  }
}
