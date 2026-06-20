import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CampaignStatus } from '@ee/shared-types';
import { Campaign, CampaignDocument, CampaignRecipient } from './campaign.schema';
import { User, UserDocument } from '@/user/user.schema';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(CampaignRecipient.name) private recipientModel: Model<CampaignRecipient>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async create(dto: { name: string; subject: string; templateId: string; segmentQuery?: object }) {
    const campaign = await this.campaignModel.create(dto);
    return { message: 'Campaign created', data: campaign };
  }

  async findAll() {
    const campaigns = await this.campaignModel.find().sort({ createdAt: -1 });
    return { message: 'Campaigns fetched', data: campaigns };
  }

  async findOne(id: string) {
    const campaign = await this.campaignModel.findById(id);
    if (!campaign) throw new Error('Campaign not found');
    return { message: 'Campaign fetched', data: campaign };
  }

  async update(id: string, dto: { name?: string; subject?: string; templateId?: string }) {
    const campaign = await this.campaignModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
    if (!campaign) throw new Error('Campaign not found');
    return { message: 'Campaign updated', data: campaign };
  }

  async remove(id: string) {
    const campaign = await this.campaignModel.findByIdAndDelete(id);
    if (!campaign) throw new Error('Campaign not found');
    return { message: 'Campaign deleted', data: campaign };
  }

  async send(campaignId: string) {
    const campaign = await this.campaignModel.findById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const users = await this.userModel.find({
      'preferences.marketingOptIn': { $ne: false },
    });

    for (const user of users) {
      await this.recipientModel.create({
        campaignId,
        email: user.email,
        userId: user._id.toString(),
      });
      await this.emailQueue.add('campaign', {
        to: user.email,
        subject: campaign.subject,
        templateId: campaign.templateId,
        campaignId,
      });
    }

    campaign.status = CampaignStatus.SENT;
    campaign.stats.sent = users.length;
    await campaign.save();

    return { message: 'Campaign queued', data: campaign };
  }

  async getStats(campaignId: string) {
    const campaign = await this.campaignModel.findById(campaignId);
    return { message: 'Campaign stats', data: campaign?.stats };
  }
}
