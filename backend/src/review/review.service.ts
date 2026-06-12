import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async findAll(productId: string) {
    const reviews = await this.reviewModel
      .find({ product: productId })
      .populate('user', 'name email')
      .populate('product', 'title')
      .sort({ createdAt: -1 });

    return {
      message: 'Reviews fetched successfully',
      data: reviews,
      total: reviews.length,
    };
  }

  async findOne(userId: string) {
    const reviews = await this.reviewModel
      .find({ user: userId })
      .populate('user', 'name email')
      .populate('product', 'title')
      .sort({ createdAt: -1 });

    return {
      message: 'Review fetched successfully',
      data: reviews,
    };
  }

  // TODO: must effect rating in product module
  async create(createReviewDto: CreateReviewDto, userId: string) {
    const isExist = await this.reviewModel.findOne({
      product: createReviewDto.product,
      user: userId,
    });

    if (isExist) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const review = await this.reviewModel.create({
      ...createReviewDto,
      user: userId,
    });

    return {
      message: 'Review created successfully',
      data: review,
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId?: string) {
    const review = await findDocumentById(this.reviewModel, id, 'Review');

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (userId) {
      this.isUserAuthorized(review, userId);
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      {
        ...updateReviewDto,
        user: userId,
        product: review.product,
      },
      {
        new: true,
      },
    );

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

    await review.deleteOne();

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
}
