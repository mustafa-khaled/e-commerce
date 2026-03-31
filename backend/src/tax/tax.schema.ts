import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaxDocument = HydratedDocument<TaxRule>;

export enum TaxClass {
  STANDARD = 'standard',   // 14% VAT
  EXEMPT   = 'exempt',     // 0%
}

@Schema({ timestamps: true, versionKey: false })
export class TaxRule {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: TaxClass, unique: true })
  taxClass: TaxClass;

  @Prop({ required: true, min: 0, max: 100, default: 0 })
  rate: number;

  @Prop({ default: true })
  appliesToShipping: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const TaxRuleSchema = SchemaFactory.createForClass(TaxRule);
