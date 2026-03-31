import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, versionKey: false })
export class Category {
  @Prop({ required: true, unique: true, type: String, minlength: 3, maxLength: 30 })
  name: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TaxRule', default: null })
  taxRule?: Types.ObjectId;

  @Prop({ select: false })
  __v: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
