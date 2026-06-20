import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  EmailProcessor,
  OrderProcessor,
  ReportingProcessor,
  InventoryProcessor,
} from './queue.processors';
import { OrderModule } from '@/order/order.module';
import { ReportingModule } from '@/reporting/reporting.module';
import { InventoryModule } from '@/inventory/inventory.module';
import { getRedisConnection } from './redis.config';
import { QueueSchedulerService } from './queue.scheduler';

@Module({
  imports: [
    BullModule.forRoot({
      connection: getRedisConnection(),
    }),
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'order' },
      { name: 'payment' },
      { name: 'push' },
      { name: 'reporting' },
      { name: 'inventory' },
    ),
    OrderModule,
    ReportingModule,
    InventoryModule,
  ],
  providers: [EmailProcessor, OrderProcessor, ReportingProcessor, InventoryProcessor, QueueSchedulerService],
  exports: [BullModule],
})
export class QueueModule {}
