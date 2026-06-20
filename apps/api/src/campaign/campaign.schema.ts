import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CampaignStatus } from '@ee/shared-types';

export type CampaignDocument = HydratedDocument<Campaign>;
export type CampaignRecipientDocument = HydratedDocument<CampaignRecipient>;

@Schema({ timestamps: true, versionKey: false })
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  templateId: string;

  @Prop({ type: Object })
  segmentQuery?: Record<string, unknown>;

  @Prop({ type: String, enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Prop()
  scheduledAt?: Date;

  @Prop({ type: Object, default: { sent: 0, opened: 0, clicked: 0, failed: 0 } })
  stats: { sent: number; opened: number; clicked: number; failed: number };
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

@Schema({ timestamps: true, versionKey: false })
export class CampaignRecipient {
  @Prop({ required: true })
  campaignId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  userId?: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  sentAt?: Date;

  @Prop()
  openedAt?: Date;
}

export const CampaignRecipientSchema = SchemaFactory.createForClass(CampaignRecipient);
