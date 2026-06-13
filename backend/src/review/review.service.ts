import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model, Types } from 'mongoose';
import { findDocumentById, validateObjectId } from '@/common/utils';
import { Product } from '@/product/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(productId: string) {
    validateObjectId(productId, 'Product');

    const reviews = await this.reviewModel
      .find({ product: productId, isActive: true })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return {
      message: 'Reviews fetched successfully',
      data: reviews,
      total: reviews.length,
    };
  }

  async findByUser(userId: string) {
    validateObjectId(userId, 'User');

    const reviews = await this.reviewModel
      .find({ user: userId, isActive: true })
      .populate('user', 'name email')
      .populate('product', 'title')
      .sort({ createdAt: -1 });

    return {
      message: 'Reviews fetched successfully',
      data: reviews,
    };
  }

  async create(createReviewDto: CreateReviewDto, userId: string) {
    await findDocumentById(
      this.productModel,
      createReviewDto.product.toString(),
      'Product',
    );

    const existing = await this.reviewModel.findOne({
      product: createReviewDto.product,
      user: userId,
      isActive: true,
    });

    if (existing) {
      throw new BadRequestException('You have already reviewed this product');
    }

    try {
      const review = await this.reviewModel.create({
        ...createReviewDto,
        user: userId,
      });

      await this.updateProductRating(createReviewDto.product);

      return {
        message: 'Review created successfully',
        data: review,
      };
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new BadRequestException('You have already reviewed this product');
      }
      throw error;
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId?: string) {
    const review = await findDocumentById(this.reviewModel, id, 'Review');

    if (userId) {
      this.isUserAuthorized(review, userId);
    }

    if (!review.isActive) {
      throw new BadRequestException('Review is no longer active');
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
      { new: true, runValidators: true },
    );

    await this.updateProductRating(review.product);

    return {
      message: 'Review updated successfully',
      data: updatedReview,
    };
  }

  async remove(id: string, userId?: string) {
    const review = await findDocumentById(this.reviewModel, id, 'Review');

    if (userId) {
      this.isUserAuthorized(review, userId);
    }

    if (!review.isActive) {
      throw new BadRequestException('Review is already deleted');
    }

    await review.deleteOne();
    await this.updateProductRating(review.product);

    return {
      message: 'Review deleted successfully',
    };
  }

  private isUserAuthorized(review: Review, userId: string) {
    if (review.user.toString() !== userId) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    );
  }

  private async updateProductRating(productId: Types.ObjectId) {
    const [result] = await this.reviewModel.aggregate<{
      ratingsQuantity: number;
      ratingsAverage: number;
    }>([
      { $match: { product: productId, isActive: true } },
      {
        $group: {
          _id: null,
          ratingsQuantity: { $sum: 1 },
          ratingsAverage: { $avg: '$rating' },
        },
      },
    ]);

    const ratingsQuantity = result?.ratingsQuantity ?? 0;
    const ratingsAverage = result?.ratingsAverage ?? 0;

    await this.productModel.findByIdAndUpdate(productId, {
      ratingsAverage,
      ratingsQuantity,
    });
  }
}
