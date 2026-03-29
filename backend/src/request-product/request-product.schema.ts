import { User } from '@/user/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RequestProductDocument = HydratedDocument<RequestProduct>;

@Schema({ timestamps: true, versionKey: false })
export class RequestProduct {
  @Prop({ required: true, type: String })
  titleNeed: string;

  @Prop({ required: true, type: String, minLength: 5 })
  details: string;

  @Prop({ required: true, type: Number, min: 1 })
  quantity: number;

  @Prop({ required: false, type: String })
  category: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ select: false })
  __v: number;
}

export const RequestProductSchema =
  SchemaFactory.createForClass(RequestProduct);
