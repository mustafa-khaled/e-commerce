import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  RequestProduct,
  RequestProductDocument,
} from './request-product.schema';
import { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name)
    private readonly requestModel: Model<RequestProductDocument>,
  ) {}

  async findAll() {
    const requests = await this.requestModel.find();

    return {
      message: 'Requests fetched successfully',
      results: requests.length,
      data: requests,
    };
  }

  async findOne(id: string) {
    const requestProduct = await findDocumentById(
      this.requestModel,
      id,
      'RequestProduct',
    );

    return {
      message: 'Request product fetched successfully',
      data: requestProduct,
    };
  }

  async create(
    createRequestProductDto: CreateRequestProductDto,
    userId: string,
  ) {
    const reqProduct = await this.requestModel.findOne({
      user: userId,
      titleNeed: createRequestProductDto.titleNeed,
    });

    if (reqProduct) {
      throw new BadRequestException('You have already requested this product');
    }

    const newReqProduct = await this.requestModel.create({
      ...createRequestProductDto,
      user: userId,
    });

    return {
      message: 'Request product created successfully',
      data: newReqProduct,
    };
  }

  async update(id: string, updateRequestProductDto: UpdateRequestProductDto) {
    return {
      message: 'Request product updated successfully',
    };
  }

  async remove(id: string) {
    const requestProduct = await findDocumentById(
      this.requestModel,
      id,
      'RequestProduct',
    );

    await requestProduct.deleteOne();

    return {
      message: 'Request product deleted successfully',
    };
  }
}
