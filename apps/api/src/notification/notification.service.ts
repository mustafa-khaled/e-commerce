import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationChannel } from '@ee/shared-types';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private firebaseApp: unknown = null;

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private mailerService: MailerService,
  ) {
    this.initFirebase();
  }

  private async initFirebase() {
    try {
      if (process.env.FIREBASE_PROJECT_ID) {
        const admin = await import('firebase-admin');
        if (!admin.apps.length) {
          this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
          });
        }
      }
    } catch (e) {
      this.logger.warn('Firebase not configured');
    }
  }

  async sendEmail(to: string, subject: string, html: string, userId?: string) {
    try {
      if (process.env.EMAIL_USER) {
        await this.mailerService.sendMail({ to, subject, html });
      }
      await this.notificationModel.create({
        userId,
        channel: NotificationChannel.EMAIL,
        template: subject,
        payload: { to, subject },
        status: 'sent',
        sentAt: new Date(),
      });
    } catch (e) {
      this.logger.error('Email send failed', e);
    }
  }

  async sendPush(fcmToken: string, title: string, body: string, userId?: string) {
    try {
      if (this.firebaseApp) {
        const admin = await import('firebase-admin');
        await admin.messaging().send({
          token: fcmToken,
          notification: { title, body },
        });
      }
      await this.notificationModel.create({
        userId,
        channel: NotificationChannel.PUSH,
        template: title,
        payload: { body },
        status: 'sent',
        sentAt: new Date(),
      });
    } catch (e) {
      this.logger.warn('Push notification skipped or failed');
    }
  }

  async sendOrderConfirmation(email: string, orderNumber: string) {
    await this.sendEmail(
      email,
      `Order Confirmed - ${orderNumber}`,
      `<h1>Thank you for your order!</h1><p>Order <strong>${orderNumber}</strong> has been confirmed.</p>`,
    );
  }

  async registerDevice(userId: string, token: string, platform: string) {
    return { message: 'Device registered', data: { userId, token, platform } };
  }
}
