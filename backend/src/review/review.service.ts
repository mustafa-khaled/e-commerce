import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import mongoose, { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';
import { QueryReviewDto } from './dto/query-review.dto';
import { Product } from '@/product/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(query: QueryReviewDto) {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const filter: mongoose.QueryFilter<Review> = {};

    if (query.product) filter.product = query.product;
    if (query.user) filter.user = query.user;
    if (query.rating) filter.rating = query.rating;
    if (query.isActive !== undefined) filter.isActive = query.isActive;

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ [sort]: sortOrder === 'asc' ? 1 : -1 })
        .populate('user', 'name email')
        .populate('product', 'name slug')
        .exec(),

      this.reviewModel.countDocuments(filter),
    ]);

    return {
      message: 'Reviews fetched successfully',
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const review = await findDocumentById(this.reviewModel, id, 'Review');

    // Populate references consistently with findAll
    await review.populate('user', 'name email');
    await review.populate('product', 'name slug');

    return {
      message: 'Review fetched successfully',
      data: review,
    };
  }

  async create(createReviewDto: CreateReviewDto, userId: string) {
    // Validate that the product exists
    await findDocumentById(
      this.productModel,
      createReviewDto.product.toString(),
      'Product',
    );

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

    if (userId) {
      this.isUserAuthorized(review, userId);
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
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
