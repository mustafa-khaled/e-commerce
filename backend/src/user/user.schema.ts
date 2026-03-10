import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from './enums/user-role.enum';
import { Gender } from './enums/gender.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String, minlength: 3, maxLength: 30 })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, type: String, minLength: 8, select: false })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, required: false })
  avatar?: string;

  @Prop({ type: Number, min: 18, max: 100, required: false })
  age?: number;

  @Prop({ type: String, required: false })
  phoneNumber?: string;

  @Prop({ type: String, required: false })
  address?: string;

  @Prop({ type: Boolean, default: true, select: false })
  active: boolean;

  @Prop({ type: String, required: false })
  verificationCode?: string;

  @Prop({ type: String, enum: Gender, required: false })
  gender?: Gender;

  @Prop({ select: false })
  __v: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
