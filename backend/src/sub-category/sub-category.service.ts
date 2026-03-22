import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-category.schema';
import { Model } from 'mongoose';
import { escapeRegex } from '@/common/utils/escape-regex.util';
import { CategoryService } from '@/category/category.service';
import {
  findDocumentById,
  validateObjectId,
} from '@/common/utils/find-by-id.util';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll() {
    const subCategories = await this.subCategoryModel.find();

    return {
      message: 'Sub-categories fetched successfully',
      results: subCategories.length,
      data: subCategories,
    };
  }

  async findOne(id: string) {
    const subCategory = await (
      await findDocumentById(this.subCategoryModel, id, 'Sub-category')
    ).populate('category');

    return {
      message: 'Sub-category fetched successfully',
      data: subCategory,
    };
  }

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const isExist = await this.subCategoryModel.findOne({
      name: {
        $regex: `^${escapeRegex(createSubCategoryDto.name)}$`,
        $options: 'i',
      },
    });

    if (isExist) throw new BadRequestException('Sub-category already exists');

    // categoryService.findOne throws its own NotFoundException so we don't need a null check here
    await this.categoryService.findOne(createSubCategoryDto.category);

    const newSubCategory =
      await this.subCategoryModel.create(createSubCategoryDto);

    return {
      message: 'Sub-category created successfully',
      data: newSubCategory,
    };
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    validateObjectId(id, 'Sub-category');

    if (updateSubCategoryDto.name) {
      const isExist = await this.subCategoryModel.findOne({
        name: {
          $regex: `^${escapeRegex(updateSubCategoryDto.name)}$`,
          $options: 'i',
        },
        _id: { $ne: id },
      });
      if (isExist) throw new BadRequestException('Sub-category already exists');
    }

    if (updateSubCategoryDto.category) {
      // Validate that the new parent category exists
      await this.categoryService.findOne(updateSubCategoryDto.category);
    }

    const subCategory = await this.subCategoryModel.findByIdAndUpdate(
      id,
      updateSubCategoryDto,
      { new: true },
    );

    if (!subCategory) {
      throw new BadRequestException('Sub-category not found or invalid ID');
    }

    return {
      message: 'Sub-category updated successfully',
      data: subCategory,
    };
  }

  async remove(id: string) {
    const subCategory = await findDocumentById(
      this.subCategoryModel,
      id,
      'Sub-category',
    );

    await subCategory.deleteOne();

    return {
      message: 'Sub-category deleted successfully',
    };
  }
}
