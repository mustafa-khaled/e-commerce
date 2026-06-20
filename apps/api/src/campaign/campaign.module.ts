import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { Campaign, CampaignSchema, CampaignRecipient, CampaignRecipientSchema } from './campaign.schema';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { User, UserSchema } from '@/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: CampaignRecipient.name, schema: CampaignRecipientSchema },
      { name: User.name, schema: UserSchema },
    ]),
    BullModule.registerQueue({ name: 'email' }),
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
