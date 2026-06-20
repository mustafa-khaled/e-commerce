import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, minLength: 3, maxLength: 100 })
  name: string;

  @Prop({
    required: true,
    type: Date,
    validate: {
      validator: function (v: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: 'Expiry date must be at least today!',
    },
  })
  expiryDate: Date;

  @Prop({ required: true, type: Number, min: 0, max: 100 })
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
