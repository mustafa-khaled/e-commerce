import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from '@/coupon/coupon.schema';
import { TaxRule, TaxRuleSchema } from '@/tax/tax.schema';
import { Category, CategorySchema } from '@/category/category.schema';
import { Product, ProductSchema } from '@/product/product.schema';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { ShippingModule } from '@/shipping/shipping.module';
import { CurrencyModule } from '@/currency/currency.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: TaxRule.name, schema: TaxRuleSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ShippingModule,
    CurrencyModule,
  ],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
