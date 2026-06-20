import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from './enums/user-role.enum';
import { Gender } from './enums/gender.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class UserAddress {
  @Prop()
  label?: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  street: string;

  @Prop()
  postalCode?: string;

  @Prop({ default: false })
  isDefault?: boolean;
}

@Schema({ _id: false })
export class UserPreferences {
  @Prop({ default: 'ar' })
  locale: string;

  @Prop({ default: 'EGP' })
  currency: string;

  @Prop({ default: true })
  marketingOptIn: boolean;

  @Prop({ default: true })
  pushOptIn: boolean;
}

@Schema({ _id: false })
export class FcmToken {
  @Prop({ required: true })
  token: string;

  @Prop({ default: 'web' })
  platform: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

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

  @Prop({ type: [UserAddress], default: [] })
  addresses: UserAddress[];

  @Prop({ type: UserPreferences, default: () => ({}) })
  preferences: UserPreferences;

  @Prop({ type: [FcmToken], default: [] })
  fcmTokens: FcmToken[];

  @Prop({ type: Boolean, default: true, select: false })
  active: boolean;

  @Prop({ type: String, required: false, select: false })
  verificationCode?: string;

  @Prop({ type: Date, required: false, select: false })
  passwordResetVerifiedAt?: Date;

  @Prop({ type: String, enum: Gender, required: false })
  gender?: Gender;

  @Prop({ select: false })
  __v: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
