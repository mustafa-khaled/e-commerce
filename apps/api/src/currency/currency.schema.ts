import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrencyDocument = HydratedDocument<Currency>;

@Schema({ timestamps: true, versionKey: false })
export class Currency {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ default: 2 })
  decimals: number;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);

@Schema({ timestamps: true, versionKey: false })
export class ExchangeRate {
  @Prop({ required: true, default: 'EGP' })
  base: string;

  @Prop({ required: true })
  quote: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ default: 'manual' })
  source: string;

  @Prop({ required: true })
  effectiveAt: Date;
}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate);
