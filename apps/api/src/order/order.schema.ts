import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@ee/shared-types';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderLineItem {
  @Prop({ required: true })
  productId: string;

  @Prop()
  variantSku?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ default: 0 })
  taxAmount: number;

  @Prop({ required: true })
  lineTotal: number;
}

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  street: string;

  @Prop()
  postalCode?: string;
}

@Schema({ _id: false })
export class OrderPricing {
  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  shipping: number;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'EGP' })
  currency: string;

  @Prop()
  fxRate?: number;
}

@Schema({ _id: false })
export class OrderTimelineEntry {
  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  at: Date;

  @Prop()
  by?: string;

  @Prop({ type: Object })
  meta?: Record<string, unknown>;
}

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  guestEmail?: string;

  @Prop()
  guestPhone?: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING_PAYMENT })
  status: OrderStatus;

  @Prop({ type: [OrderLineItem], required: true })
  items: OrderLineItem[];

  @Prop({ type: OrderPricing, required: true })
  pricing: OrderPricing;

  @Prop({ type: Address, required: true })
  shippingAddress: Address;

  @Prop({ type: Address })
  billingAddress?: Address;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ type: Object })
  shipping?: {
    zoneId?: string;
    methodId?: string;
    cost: number;
    estimatedDelivery?: string;
  };

  @Prop()
  couponCode?: string;

  @Prop()
  notes?: string;

  @Prop({ type: [OrderTimelineEntry], default: [] })
  timeline: OrderTimelineEntry[];

  @Prop()
  idempotencyKey?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ guestEmail: 1, orderNumber: 1 });
