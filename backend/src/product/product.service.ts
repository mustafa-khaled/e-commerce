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

  async findAll() {
    const products = await this.productModel.find();

    return {
      data: products,
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
