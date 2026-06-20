import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShippingZoneDocument = HydratedDocument<ShippingZone>;
export type ShippingMethodDocument = HydratedDocument<ShippingMethod>;

@Schema({ timestamps: true, versionKey: false })
export class ShippingZone {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  countries: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ShippingZoneSchema = SchemaFactory.createForClass(ShippingZone);

@Schema({ timestamps: true, versionKey: false })
export class ShippingMethod {
  @Prop({ type: Types.ObjectId, ref: 'ShippingZone', required: true })
  zoneId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['flat', 'weight_based', 'free_over_threshold'] })
  type: string;

  @Prop({ type: Object, required: true })
  rules: {
    minOrder?: number;
    maxWeight?: number;
    rate: number;
    freeShippingThreshold?: number;
    cities?: string[];
  };

  @Prop({ default: 2 })
  estimatedDaysMin: number;

  @Prop({ default: 5 })
  estimatedDaysMax: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ShippingMethodSchema = SchemaFactory.createForClass(ShippingMethod);
