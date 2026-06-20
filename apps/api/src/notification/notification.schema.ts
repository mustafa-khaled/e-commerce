import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NotificationChannel } from '@ee/shared-types';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true, versionKey: false })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  guestId?: string;

  @Prop({ type: String, enum: NotificationChannel, required: true })
  channel: NotificationChannel;

  @Prop({ required: true })
  template: string;

  @Prop({ type: Object })
  payload: Record<string, unknown>;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  sentAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
