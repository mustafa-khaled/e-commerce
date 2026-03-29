import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true, versionKey: false })
export class Supplier {
  @Prop({ required: true, unique: true, type: String, minLength: 3, maxLength: 100 })
  name: string;

  @Prop({ required: true, type: String })
  website: string;

  @Prop({ select: false })
  __v: number;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
