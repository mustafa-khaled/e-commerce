import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DailySalesSummaryDocument = HydratedDocument<DailySalesSummary>;

@Schema({ timestamps: true, versionKey: false })
export class DailySalesSummary {
  @Prop({ required: true })
  date: string;

  @Prop({ default: 'EG' })
  country: string;

  @Prop({ default: 'EGP' })
  currency: string;

  @Prop({ default: 0 })
  ordersCount: number;

  @Prop({ default: 0 })
  grossRevenue: number;

  @Prop({ default: 0 })
  netRevenue: number;

  @Prop({ default: 0 })
  refunds: number;

  @Prop({ default: 0 })
  avgOrderValue: number;
}

export const DailySalesSummarySchema = SchemaFactory.createForClass(DailySalesSummary);
DailySalesSummarySchema.index({ date: 1, country: 1 }, { unique: true });
