import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';
import { escapeRegex } from '@/common/utils/escape-regex.util';
import { Category, CategoryDocument } from '@/category/category.schema';
import {
  SubCategory,
  SubCategoryDocument,
} from '@/sub-category/sub-category.schema';
import { Brand, BrandDocument } from '@/brand/brand.schema';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategoryDocument>,

    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
  ) {}

  async findAll(query: QueryProductDto) {
    const requestQuery: Record<string, unknown> = { ...query };
    const removeFields = [
      'page',
      'limit',
      'sort',
      'sortOrder',
      'keyword',
      'category',
      'fields',
    ];

    removeFields.forEach((field) => delete requestQuery[field]);

    const filterString = JSON.stringify(requestQuery).replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`,
    );

    const parsed: unknown = JSON.parse(filterString);

    const filter: Record<string, unknown> =
      typeof parsed === 'object' && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.keyword) {
      filter.title = {
        $regex: escapeRegex(query.keyword),
      };

      filter.description = {
        $regex: escapeRegex(query.keyword),
      };
    }

    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (query.sort) {
      const order: 1 | -1 = query.sortOrder === 'asc' ? 1 : -1;
      sortQuery = { [query.sort]: order };
    }

    const fields = query.fields
      ? (query.fields as unknown as string).split(',').join(' ')
      : '';

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select(fields),

      this.productModel.countDocuments(filter),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Products fetched successfully',
    };
  }

  async findOne(id: string) {
    const product = await findDocumentById(this.productModel, id, 'Product');

    return {
      message: 'Product fetched successfully',
      data: product,
    };
  }

  async create(createProductDto: CreateProductDto) {
    const isExist = await this.productModel.findOne({
      title: {
        $regex: `^${escapeRegex(createProductDto.title)}$`,
        $options: 'i',
      },
    });

    if (isExist) throw new BadRequestException('Product already exists');

    const category = await findDocumentById(
      this.categoryModel,
      createProductDto.category,
      'Category',
    );

    if (!category) throw new BadRequestException('Category not found');

    if (createProductDto.subCategory) {
      const subCategory = await findDocumentById(
        this.subCategoryModel,
        createProductDto.subCategory,
        'SubCategory',
      );

      if (!subCategory) throw new BadRequestException('SubCategory not found');
    }

    if (createProductDto.brand) {
      const brand = await findDocumentById(
        this.brandModel,
        createProductDto.brand,
        'Brand',
      );

      if (!brand) throw new BadRequestException('Brand not found');
    }

    const product = await this.productModel.create(createProductDto);

    return {
      message: 'Product created successfully',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await findDocumentById(this.productModel, id, 'Product');

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
      },
    );

    return {
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }

  async remove(id: string) {
    const product = await findDocumentById(this.productModel, id, 'Product');

    await product.deleteOne();

    return {
      message: 'Product deleted successfully',
    };
  }
}
