import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true, versionKey: false })
export class SubCategory {
  @Prop({ required: true, unique: true, type: String, minlength: 3, maxLength: 30 })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ select: false })
  __v: number;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
