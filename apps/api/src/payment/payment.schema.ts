import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentStatus } from '@ee/shared-types';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true, versionKey: false })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true, enum: ['kashier', 'cod'] })
  provider: string;

  @Prop()
  providerRef?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'EGP' })
  currency: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ unique: true, sparse: true })
  idempotencyKey?: string;

  @Prop({ type: Object })
  rawWebhookPayload?: Record<string, unknown>;

  @Prop()
  paidAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
