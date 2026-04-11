import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';
import { escapeRegex } from '@/common/utils/escape-regex.util';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  findAll() {
    const products = this.productModel.find().exec();

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
      name: {
        $regex: `^${escapeRegex(createProductDto.title)}$`,
        $options: 'i',
      },
    });

    if (isExist) throw new BadRequestException('Product already exists');

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
      data: product,
    };
  }
}
