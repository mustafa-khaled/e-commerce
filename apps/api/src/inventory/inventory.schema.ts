import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReservationStatus } from '@ee/shared-types';

export type InventoryLedgerDocument = HydratedDocument<InventoryLedger>;
export type InventoryReservationDocument = HydratedDocument<InventoryReservation>;

@Schema({ timestamps: true, versionKey: false })
export class InventoryLedger {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop()
  variantSku?: string;

  @Prop({ required: true })
  delta: number;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  referenceType: string;

  @Prop({ required: true })
  referenceId: string;

  @Prop({ required: true })
  balanceAfter: number;
}

export const InventoryLedgerSchema = SchemaFactory.createForClass(InventoryLedger);

@Schema({ timestamps: true, versionKey: false })
export class InventoryReservation {
  @Prop({ required: true, unique: true })
  reservationId: string;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop()
  variantSku?: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop()
  cartId?: string;

  @Prop()
  orderId?: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ type: String, enum: ReservationStatus, default: ReservationStatus.ACTIVE })
  status: ReservationStatus;
}

export const InventoryReservationSchema = SchemaFactory.createForClass(InventoryReservation);
InventoryReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
