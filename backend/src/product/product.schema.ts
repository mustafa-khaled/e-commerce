import { Brand } from '@/brand/brand.schema';
import { Category } from '@/category/category.schema';
import { SubCategory } from '@/sub-category/sub-category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, unique: true, minLength: 3 })
  title: string;

  @Prop({ required: true, minLength: 20 })
  description: string;

  @Prop({ required: true, type: Number, min: 1, default: 1 })
  quantity: number;

  @Prop({ required: true, type: String })
  imageCover: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ required: true, type: Number, min: 1 })
  price: number;

  @Prop({ type: Number, min: 1 })
  priceAfterDiscount: number;

  @Prop({ type: [String] })
  colors: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: Category.name })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: SubCategory.name })
  subCategory?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Brand.name })
  brand?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  ratingsAverage: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity: number;

  @Prop({ select: false })
  __v: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
