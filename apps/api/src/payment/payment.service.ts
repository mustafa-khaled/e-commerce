import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'crypto';
import { OrderStatus, PaymentStatus } from '@ee/shared-types';
import { Payment, PaymentDocument } from './payment.schema';
import { Order, OrderDocument } from '@/order/order.schema';
import { OrderService } from '@/order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private orderService: OrderService,
  ) {}

  async createKashierSession(
    orderId: string,
    redirectUrl: string,
    userId?: string,
    guestId?: string,
  ) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new BadRequestException('Order not found');

    this.assertOrderAccess(order, userId, guestId);

    const merchantId = process.env.KASHIER_MERCHANT_ID;
    const secretKey = process.env.KASHIER_SECRET_KEY;
    const mode = process.env.KASHIER_MODE || 'test';

    if (!merchantId || !secretKey) {
      return {
        message: 'Kashier not configured - use test mode',
        data: {
          paymentUrl: `${redirectUrl}?orderId=${orderId}&status=test`,
          orderId,
        },
      };
    }

    const amount = order.pricing.total;
    const orderIdRef = order.orderNumber;
    const hash = createHash('sha256')
      .update(`${merchantId}${orderIdRef}${amount}${secretKey}`)
      .digest('hex');

    const baseUrl =
      mode === 'live'
        ? 'https://checkout.kashier.io'
        : 'https://test-checkout.kashier.io';

    const paymentUrl = `${baseUrl}/?merchantId=${merchantId}&orderId=${orderIdRef}&amount=${amount}&currency=${order.pricing.currency}&hash=${hash}&redirect=${encodeURIComponent(redirectUrl)}`;

    await this.paymentModel.create({
      orderId,
      provider: 'kashier',
      amount,
      currency: order.pricing.currency,
      status: PaymentStatus.PENDING,
      providerRef: orderIdRef,
    });

    return { message: 'Payment session created', data: { paymentUrl, orderId } };
  }

  async handleKashierWebhook(body: Record<string, unknown>, signature?: string) {
    const secretKey = process.env.KASHIER_SECRET_KEY;
    if (!secretKey) {
      throw new BadRequestException('Webhook not configured');
    }
    if (!signature) {
      throw new BadRequestException('Missing webhook signature');
    }
    const expected = createHash('sha256')
      .update(JSON.stringify(body) + secretKey)
      .digest('hex');
    if (expected !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const orderNumber = body.orderId as string;
    const status = body.status as string;

    if (status === 'paid' || status === 'SUCCESS') {
      const order = await this.orderModel.findOne({ orderNumber });
      if (!order) return { received: true };

      const idempotencyKey = `kashier-${orderNumber}`;
      const existing = await this.paymentModel.findOne({ idempotencyKey });
      if (existing?.status === PaymentStatus.PAID) return { received: true };

      await this.paymentModel.findOneAndUpdate(
        { orderId: order._id },
        {
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          rawWebhookPayload: body,
          idempotencyKey,
        },
        { upsert: true },
      );

      await this.orderService.confirmPayment(order._id.toString());
    }

    return { received: true };
  }

  async handleKashierCallback(orderNumber: string, status: string) {
    const webUrl = process.env.WEB_URL || 'http://localhost:3000';
    const locale = process.env.DEFAULT_LOCALE || 'ar';

    if (status === 'paid' || status === 'SUCCESS') {
      const order = await this.orderModel.findOne({ orderNumber });
      if (order) {
        await this.orderService.confirmPayment(order._id.toString());
        return `${webUrl}/${locale}/checkout/success?orderNumber=${order.orderNumber}&email=${encodeURIComponent(order.guestEmail || '')}`;
      }
    }

    return `${webUrl}/${locale}/checkout?payment=failed`;
  }

  private assertOrderAccess(
    order: OrderDocument,
    userId?: string,
    guestId?: string,
  ) {
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException('Order is not awaiting payment');
    }

    if (userId) {
      if (order.userId?.toString() !== userId) {
        throw new BadRequestException('Unauthorized access to order');
      }
      return;
    }

    if (!order.userId && guestId) {
      return;
    }

    throw new BadRequestException('Unauthorized access to order');
  }

  async confirmCod(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new BadRequestException('Order not found');

    await this.paymentModel.create({
      orderId,
      provider: 'cod',
      amount: order.pricing.total,
      currency: order.pricing.currency,
      status: PaymentStatus.PENDING,
    });

    return { message: 'COD payment recorded', data: order };
  }
}
