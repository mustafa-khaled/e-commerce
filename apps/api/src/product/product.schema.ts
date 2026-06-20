import { Brand } from '@/brand/brand.schema';
import { Category } from '@/category/category.schema';
import { SubCategory } from '@/sub-category/sub-category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class ProductVariant {
  @Prop({ required: true })
  sku: string;

  @Prop({ type: Object, default: {} })
  attributes: Record<string, string>;

  @Prop({ required: true })
  price: number;

  @Prop()
  priceAfterDiscount?: number;

  @Prop({ required: true, min: 0, default: 0 })
  quantity: number;
}

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, unique: true, minLength: 3 })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, minLength: 20 })
  description: string;

  @Prop({ type: Object, default: {} })
  translations: Record<string, { title?: string; description?: string }>;

  @Prop({ required: true, type: Number, min: 0, default: 1 })
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

  @Prop({ type: [ProductVariant], default: [] })
  variants: ProductVariant[];

  @Prop({ default: 'DEFAULT' })
  sku: string;

  @Prop({ default: true })
  trackInventory: boolean;

  @Prop({ default: 5 })
  lowStockThreshold: number;

  @Prop({ default: 'EGP' })
  baseCurrency: string;

  @Prop({ default: true })
  isActive: boolean;

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
ProductSchema.index({ title: 'text', description: 'text' });
