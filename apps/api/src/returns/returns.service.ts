import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReturnStatus } from '@ee/shared-types';
import { ReturnRequest, ReturnDocument } from './returns.schema';
import { Order, OrderDocument } from '@/order/order.schema';
import { InventoryService } from '@/inventory/inventory.service';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectModel(ReturnRequest.name) private returnModel: Model<ReturnDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private inventoryService: InventoryService,
  ) {}

  private generateReturnNumber() {
    return `RMA-${Date.now()}`;
  }

  async create(dto: {
    orderNumber: string;
    email?: string;
    userId?: string;
    items: { productId: string; variantSku?: string; quantity: number; reason: string }[];
  }) {
    const filter: Record<string, unknown> = { orderNumber: dto.orderNumber };
    if (dto.email) filter.guestEmail = dto.email;
    if (dto.userId) filter.userId = dto.userId;

    const order = await this.orderModel.findOne(filter);
    if (!order) throw new BadRequestException('Order not found');

    const returnReq = await this.returnModel.create({
      returnNumber: this.generateReturnNumber(),
      orderId: order._id,
      userId: dto.userId,
      guestEmail: dto.email,
      items: dto.items,
      status: ReturnStatus.REQUESTED,
    });

    return { message: 'Return requested', data: returnReq };
  }

  async updateStatus(returnId: string, status: ReturnStatus) {
    const returnReq = await this.returnModel.findByIdAndUpdate(
      returnId,
      { status },
      { new: true },
    );
    if (!returnReq) throw new BadRequestException('Return not found');

    if (status === ReturnStatus.REFUNDED) {
      for (const item of returnReq.items) {
        await this.inventoryService.restock(
          item.productId,
          item.quantity,
          item.variantSku,
          returnReq.returnNumber,
        );
      }
    }

    return { message: 'Return updated', data: returnReq };
  }

  async findByOrder(orderId: string) {
    const returns = await this.returnModel.find({ orderId });
    return { message: 'Returns fetched', data: returns };
  }

  async findAll(status?: ReturnStatus) {
    const filter = status ? { status } : {};
    const returns = await this.returnModel.find(filter).sort({ createdAt: -1 }).limit(100);
    return { message: 'Returns fetched', data: returns };
  }
}
