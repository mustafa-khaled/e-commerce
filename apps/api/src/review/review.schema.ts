import { Product } from '@/product/product.schema';
import { User } from '@/user/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true, versionKey: false })
export class Review extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Product.name })
  product: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 1, max: 5 })
  rating: number;

  @Prop({
    required: false,
    type: String,
    trim: true,
    minlength: 3,
    maxLength: 500,
  })
  comment?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// One active review per user per product (allows re-review after soft delete)
ReviewSchema.index(
  { product: 1, user: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);
// Fast active product review listing (sorted by newest)
ReviewSchema.index({ product: 1, isActive: 1, createdAt: -1 });
// Fast user review lookup
ReviewSchema.index({ user: 1 });
