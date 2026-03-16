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

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (category) throw new BadRequestException('Category already exists');
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return {
      status: 201,
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  async findAll() {
    return {
      status: 200,
      message: 'This action returns all category',
      data: await this.categoryModel.find(),
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Category not found');
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return {
      status: 200,
      message: 'Category fetched successfully',
      data: category,
    };
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
