import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ _id: false })
export class CartItem {
  @Prop({ required: true })
  productId: string;

  @Prop()
  variantSku?: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  image?: string;
}

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({ required: true, unique: true })
  cartId: string;

  @Prop()
  userId?: string;

  @Prop()
  guestId?: string;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @Prop({ default: 'EGP' })
  currency: string;

  @Prop({ default: 'ar' })
  locale: string;

  @Prop()
  expiresAt?: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
