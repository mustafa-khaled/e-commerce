import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, type: String, minlength: 3, maxLength: 30 })
  name: string;

  @Prop({ type: String })
  image?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
