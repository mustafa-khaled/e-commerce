import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingMethod, ShippingMethodSchema, ShippingZone, ShippingZoneSchema } from './shipping.schema';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShippingZone.name, schema: ShippingZoneSchema },
      { name: ShippingMethod.name, schema: ShippingMethodSchema },
    ]),
  ],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}
