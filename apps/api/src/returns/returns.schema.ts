import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReturnStatus } from '@ee/shared-types';

export type ReturnDocument = HydratedDocument<ReturnRequest>;

@Schema({ _id: false })
export class ReturnItem {
  @Prop({ required: true })
  productId: string;

  @Prop()
  variantSku?: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  reason: string;

  @Prop()
  condition?: string;
}

@Schema({ timestamps: true, versionKey: false })
export class ReturnRequest {
  @Prop({ required: true, unique: true })
  returnNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  guestEmail?: string;

  @Prop({ type: [ReturnItem], required: true })
  items: ReturnItem[];

  @Prop({ type: String, enum: ReturnStatus, default: ReturnStatus.REQUESTED })
  status: ReturnStatus;

  @Prop({ type: Object })
  refund?: {
    amount: number;
    method: string;
    providerRef?: string;
  };
}

export const ReturnSchema = SchemaFactory.createForClass(ReturnRequest);
