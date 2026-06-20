import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@/product/product.schema';
import { InventoryLedger, InventoryLedgerSchema, InventoryReservation, InventoryReservationSchema } from './inventory.schema';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: InventoryReservation.name, schema: InventoryReservationSchema },
      { name: InventoryLedger.name, schema: InventoryLedgerSchema },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
