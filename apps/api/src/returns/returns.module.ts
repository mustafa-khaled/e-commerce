import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnRequest, ReturnSchema } from './returns.schema';
import { ReturnsService } from './returns.service';
import { ReturnsController, AdminReturnsController } from './returns.controller';
import { Order, OrderSchema } from '@/order/order.schema';
import { InventoryModule } from '@/inventory/inventory.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReturnRequest.name, schema: ReturnSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    InventoryModule,
  ],
  controllers: [ReturnsController, AdminReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {}
