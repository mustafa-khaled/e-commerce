import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AdminOrderController } from './admin-order.controller';
import { PricingModule } from '@/pricing/pricing.module';
import { InventoryModule } from '@/inventory/inventory.module';
import { NotificationModule } from '@/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    BullModule.registerQueue({ name: 'order' }),
    PricingModule,
    InventoryModule,
    NotificationModule,
  ],
  controllers: [OrderController, AdminOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
