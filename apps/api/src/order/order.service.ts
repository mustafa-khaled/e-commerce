import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@ee/shared-types';
import { Order, OrderDocument } from './order.schema';
import { PricingService } from '@/pricing/pricing.service';
import { InventoryService } from '@/inventory/inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationService } from '@/notification/notification.service';

const PAYMENT_TIMEOUT_MS = 15 * 60 * 1000;

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private pricingService: PricingService,
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    @InjectQueue('order') private orderQueue: Queue,
  ) {}

  private generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 900000) + 100000;
    return `EG-${year}-${seq}`;
  }

  async create(dto: CreateOrderDto, userId?: string, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.orderModel.findOne({ idempotencyKey });
      if (existing) return { message: 'Order already exists', data: existing };
    }

    const pricing = await this.pricingService.calculate({
      items: dto.items,
      couponCode: dto.couponCode,
      shippingMethodId: dto.shippingMethodId,
      country: dto.shippingAddress.country,
      city: dto.shippingAddress.city,
      currency: dto.currency,
    });

    const isCod = dto.paymentMethod === PaymentMethod.COD;
    const status = isCod ? OrderStatus.CONFIRMED : OrderStatus.PENDING_PAYMENT;
    const paymentStatus = isCod ? PaymentStatus.PENDING : PaymentStatus.PENDING;

    const order = await this.orderModel.create({
      orderNumber: this.generateOrderNumber(),
      userId,
      guestEmail: dto.guestEmail,
      guestPhone: dto.guestPhone,
      status,
      items: dto.items.map((item) => ({
        ...item,
        lineTotal: item.unitPrice * item.quantity,
        taxAmount: 0,
      })),
      pricing: {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        tax: pricing.tax,
        shipping: pricing.shipping,
        total: pricing.total,
        currency: pricing.currency,
      },
      shippingAddress: dto.shippingAddress,
      billingAddress: dto.billingAddress,
      paymentMethod: dto.paymentMethod,
      paymentStatus,
      shipping: {
        methodId: dto.shippingMethodId,
        cost: pricing.shipping,
      },
      couponCode: dto.couponCode,
      notes: dto.notes,
      idempotencyKey,
      timeline: [{ status, at: new Date() }],
    });

    const orderId = order._id.toString();

    try {
      for (const item of dto.items) {
        await this.inventoryService.reserve(
          item.productId,
          item.quantity,
          item.variantSku,
          { orderId },
        );
      }
    } catch (err) {
      await this.orderModel.findByIdAndDelete(orderId);
      throw err;
    }

    if (isCod) {
      await this.inventoryService.commitReservations(orderId);
      order.paymentStatus = PaymentStatus.PAID;
      await order.save();
    } else {
      await this.schedulePaymentTimeout(orderId);
    }

    if (dto.guestEmail) {
      await this.notificationService.sendOrderConfirmation(dto.guestEmail, order.orderNumber);
    }

    return { message: 'Order created', data: order };
  }

  async findByUser(userId: string) {
    const orders = await this.orderModel.find({ userId }).sort({ createdAt: -1 });
    return { message: 'Orders fetched', data: orders };
  }

  async findOne(id: string, userId?: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new BadRequestException('Order not found');
    if (userId && order.userId?.toString() !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    return { message: 'Order fetched', data: order };
  }

  async track(orderNumber: string, email: string) {
    const order = await this.orderModel.findOne({ orderNumber, guestEmail: email });
    if (!order) throw new BadRequestException('Order not found');
    return { message: 'Order tracked', data: order };
  }

  async updateStatus(orderId: string, status: OrderStatus, by?: string) {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        status,
        $push: { timeline: { status, at: new Date(), by } },
      },
      { new: true },
    );
    return { message: 'Status updated', data: order };
  }

  async confirmPayment(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new BadRequestException('Order not found');
    if (order.paymentStatus === PaymentStatus.PAID) return order;

    const job = await this.orderQueue.getJob(`payment-timeout-${orderId}`);
    if (job) await job.remove();

    await this.inventoryService.commitReservations(orderId);
    order.status = OrderStatus.CONFIRMED;
    order.paymentStatus = PaymentStatus.PAID;
    order.timeline.push({ status: OrderStatus.CONFIRMED, at: new Date() });
    await order.save();
    return order;
  }

  async cancelOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order || order.status === OrderStatus.CANCELLED) return { message: 'Already cancelled', data: order };

    await this.inventoryService.releaseReservations(orderId);
    return this.updateStatus(orderId, OrderStatus.CANCELLED);
  }

  private async schedulePaymentTimeout(orderId: string) {
    await this.orderQueue.add(
      'release-reservation',
      { orderId },
      {
        delay: PAYMENT_TIMEOUT_MS,
        jobId: `payment-timeout-${orderId}`,
        removeOnComplete: true,
      },
    );
  }
}
