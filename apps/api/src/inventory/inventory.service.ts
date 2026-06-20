import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ReservationStatus } from '@ee/shared-types';
import { Product, ProductDocument } from '@/product/product.schema';
import { InventoryLedger, InventoryReservation } from './inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(InventoryReservation.name)
    private reservationModel: Model<InventoryReservation>,
    @InjectModel(InventoryLedger.name)
    private ledgerModel: Model<InventoryLedger>,
  ) {}

  async getAvailable(productId: string, variantSku?: string): Promise<number> {
    const product = await this.productModel.findById(productId);
    if (!product) return 0;

    let quantity = product.quantity;
    if (variantSku && product.variants?.length) {
      const variant = product.variants.find((v) => v.sku === variantSku);
      quantity = variant?.quantity ?? 0;
    }

    const reserved = await this.reservationModel.aggregate([
      {
        $match: {
          productId: new Types.ObjectId(productId),
          variantSku: variantSku ?? null,
          status: ReservationStatus.ACTIVE,
        },
      },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    const reservedQty = reserved[0]?.total ?? 0;
    return Math.max(0, quantity - reservedQty);
  }

  async reserve(
    productId: string,
    quantity: number,
    variantSku: string | undefined,
    reference: { cartId?: string; orderId?: string },
    ttlMinutes = 15,
  ) {
    const available = await this.getAvailable(productId, variantSku);
    if (available < quantity) {
      throw new BadRequestException(`Insufficient stock for product ${productId}`);
    }

    const reservation = await this.reservationModel.create({
      reservationId: uuidv4(),
      productId,
      variantSku,
      quantity,
      cartId: reference.cartId,
      orderId: reference.orderId,
      expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
      status: ReservationStatus.ACTIVE,
    });

    return reservation;
  }

  async commitReservations(orderId: string) {
    const reservations = await this.reservationModel.find({
      orderId,
      status: ReservationStatus.ACTIVE,
    });

    for (const res of reservations) {
      const filter: Record<string, unknown> = { _id: res.productId };
      const update: Record<string, unknown> = {
        $inc: { sold: res.quantity },
      };

      if (res.variantSku) {
        const product = await this.productModel.findById(res.productId);
        if (product?.variants?.length) {
          const idx = product.variants.findIndex((v) => v.sku === res.variantSku);
          if (idx >= 0) {
            filter[`variants.${idx}.quantity`] = { $gte: res.quantity };
            update.$inc = {
              ...((update.$inc as object) || {}),
              [`variants.${idx}.quantity`]: -res.quantity,
              sold: res.quantity,
            };
          }
        }
      } else {
        filter.quantity = { $gte: res.quantity };
        update.$inc = { quantity: -res.quantity, sold: res.quantity };
      }

      const updated = await this.productModel.findOneAndUpdate(filter, update, { new: true });
      if (!updated) {
        throw new BadRequestException('Stock commit failed - concurrent update');
      }

      const balance = res.variantSku
        ? updated.variants?.find((v) => v.sku === res.variantSku)?.quantity ?? 0
        : updated.quantity;

      await this.ledgerModel.create({
        productId: res.productId,
        variantSku: res.variantSku,
        delta: -res.quantity,
        reason: 'sale',
        referenceType: 'order',
        referenceId: orderId,
        balanceAfter: balance,
      });

      res.status = ReservationStatus.COMMITTED;
      await res.save();
    }
  }

  async releaseReservations(orderId: string) {
    await this.reservationModel.updateMany(
      { orderId, status: ReservationStatus.ACTIVE },
      { status: ReservationStatus.RELEASED },
    );
  }

  async releaseExpiredReservations() {
    const expired = await this.reservationModel.find({
      status: ReservationStatus.ACTIVE,
      expiresAt: { $lt: new Date() },
    });

    for (const res of expired) {
      res.status = ReservationStatus.RELEASED;
      await res.save();
    }

    return expired.length;
  }

  async getLowStock(threshold = 10) {
    const products = await this.productModel.find({ isActive: true }).lean();
    const lowStock: { productId: string; title: string; available: number }[] = [];

    for (const product of products) {
      const available = await this.getAvailable(product._id.toString());
      if (available <= threshold) {
        lowStock.push({
          productId: product._id.toString(),
          title: product.title,
          available,
        });
      }
    }

    return lowStock;
  }

  async adjustStock(
    productId: string,
    delta: number,
    reason: string,
    variantSku?: string,
  ) {
    const filter: Record<string, unknown> = { _id: productId };
    const update: Record<string, unknown> = { $inc: {} };

    if (variantSku) {
      const product = await this.productModel.findById(productId);
      const idx = product?.variants?.findIndex((v) => v.sku === variantSku) ?? -1;
      if (idx < 0) throw new BadRequestException('Variant not found');
      filter[`variants.${idx}.quantity`] = delta < 0 ? { $gte: -delta } : { $exists: true };
      (update.$inc as Record<string, number>)[`variants.${idx}.quantity`] = delta;
    } else {
      if (delta < 0) filter.quantity = { $gte: -delta };
      (update.$inc as Record<string, number>).quantity = delta;
    }

    const updated = await this.productModel.findOneAndUpdate(filter, update, { new: true });
    if (!updated) throw new BadRequestException('Adjustment failed');

    const balance = variantSku
      ? updated.variants?.find((v) => v.sku === variantSku)?.quantity ?? 0
      : updated.quantity;

    await this.ledgerModel.create({
      productId,
      variantSku,
      delta,
      reason,
      referenceType: 'adjustment',
      referenceId: new Types.ObjectId().toString(),
      balanceAfter: balance,
    });

    return { productId, available: await this.getAvailable(productId, variantSku) };
  }

  async restock(productId: string, quantity: number, variantSku: string | undefined, returnId: string) {
    const update: Record<string, unknown> = { $inc: { quantity, sold: -quantity } };
    if (variantSku) {
      const product = await this.productModel.findById(productId);
      const idx = product?.variants?.findIndex((v) => v.sku === variantSku) ?? -1;
      if (idx >= 0) {
        update.$inc = { [`variants.${idx}.quantity`]: quantity, sold: -quantity };
      }
    }
    const updated = await this.productModel.findByIdAndUpdate(productId, update, { new: true });
    await this.ledgerModel.create({
      productId,
      variantSku,
      delta: quantity,
      reason: 'return',
      referenceType: 'return',
      referenceId: returnId,
      balanceAfter: updated?.quantity ?? 0,
    });
  }
}
