import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  RequestProduct,
  RequestProductDocument,
} from './request-product.schema';
import { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';
import { AuthUser } from '@/common/interfaces/auth-user.interface';
import { UserRole } from '@/user/enums/user-role.enum';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name)
    private readonly requestModel: Model<RequestProductDocument>,
  ) {}

  private assertOwnership(
    requestProduct: RequestProductDocument,
    userId: string,
    action: string,
  ): void {
    if (requestProduct.user.toString() !== userId) {
      throw new ForbiddenException(
        `You are not authorized to ${action} this request`,
      );
    }
  }

  async findAll() {
    const requests = await this.requestModel.find();

    return {
      message: 'Requests fetched successfully',
      results: requests.length,
      data: requests,
    };
  }

  async findOne(id: string, user: AuthUser) {
    const requestProduct = await findDocumentById(
      this.requestModel,
      id,
      'RequestProduct',
    );

    if (user.role === UserRole.USER) {
      this.assertOwnership(requestProduct, user._id, 'view');
    }

    return {
      message: 'Request product fetched successfully',
      data: requestProduct,
    };
  }

  async create(
    createRequestProductDto: CreateRequestProductDto,
    userId: string,
  ) {
    const existing = await this.requestModel.findOne({
      user: userId,
      titleNeed: createRequestProductDto.titleNeed,
    });

    if (existing) {
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

  async update(
    id: string,
    updateRequestProductDto: UpdateRequestProductDto,
    userId: string,
  ) {
    const requestProduct = await findDocumentById(
      this.requestModel,
      id,
      'RequestProduct',
    );

    this.assertOwnership(requestProduct, userId, 'update');

    Object.assign(
      requestProduct,
      Object.fromEntries(
        Object.entries(updateRequestProductDto).filter(
          ([, v]) => v !== undefined,
        ),
      ),
    );

    await requestProduct.save();

    return {
      message: 'Request product updated successfully',
      data: requestProduct,
    };
  }

  async remove(id: string, userId: string) {
    const requestProduct = await findDocumentById(
      this.requestModel,
      id,
      'RequestProduct',
    );

    this.assertOwnership(requestProduct, userId, 'delete');

    await requestProduct.deleteOne();

    return {
      message: 'Request product deleted successfully',
    };
  }
}
