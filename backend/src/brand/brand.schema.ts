import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true, unique: true, minlength: 3, maxLength: 100 })
  name: string;

  @Prop({ required: false })
  image: string;

  @Prop({ select: false })
  __v: number;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
