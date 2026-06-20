import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '@/order/order.schema';
import { DailySalesSummary, DailySalesSummaryDocument } from './reporting.schema';
import { OrderStatus } from '@ee/shared-types';

@Injectable()
export class ReportingService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(DailySalesSummary.name) private summaryModel: Model<DailySalesSummaryDocument>,
  ) {}

  async getOverview(from?: string, to?: string) {
    const dateFilter: Record<string, unknown> = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) (dateFilter.createdAt as Record<string, Date>).$gte = new Date(from);
      if (to) (dateFilter.createdAt as Record<string, Date>).$lte = new Date(to);
    }

    const [totalOrders, revenueAgg, pendingReturns] = await Promise.all([
      this.orderModel.countDocuments(dateFilter),
      this.orderModel.aggregate([
        { $match: { ...dateFilter, status: { $ne: OrderStatus.CANCELLED } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' }, avg: { $avg: '$pricing.total' } } },
      ]),
      this.orderModel.countDocuments({ status: OrderStatus.RETURN_REQUESTED }),
    ]);

    return {
      message: 'Overview',
      data: {
        ordersCount: totalOrders,
        grossRevenue: revenueAgg[0]?.total ?? 0,
        avgOrderValue: revenueAgg[0]?.avg ?? 0,
        pendingReturns,
      },
    };
  }

  async getSales(groupBy: 'day' | 'product' = 'day') {
    if (groupBy === 'day') {
      const data = await this.orderModel.aggregate([
        { $match: { status: { $nin: [OrderStatus.CANCELLED] } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$pricing.total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]);
      return { message: 'Sales by day', data };
    }
    const data = await this.orderModel.aggregate([
      { $match: { status: { $nin: [OrderStatus.CANCELLED] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          title: { $first: '$items.title' },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.lineTotal' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 },
    ]);
    return { message: 'Sales by product', data };
  }

  async aggregateDaily() {
    const today = new Date().toISOString().split('T')[0];
    const start = new Date(today);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const agg = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: { $ne: OrderStatus.CANCELLED } } },
      {
        $group: {
          _id: null,
          ordersCount: { $sum: 1 },
          grossRevenue: { $sum: '$pricing.total' },
          avgOrderValue: { $avg: '$pricing.total' },
        },
      },
    ]);

    const stats = agg[0] || { ordersCount: 0, grossRevenue: 0, avgOrderValue: 0 };
    await this.summaryModel.findOneAndUpdate(
      { date: today, country: 'EG' },
      { ...stats, date: today, netRevenue: stats.grossRevenue },
      { upsert: true },
    );
  }
}
