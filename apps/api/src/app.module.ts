import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SupplierModule } from './supplier/supplier.module';
import { RequestProductModule } from './request-product/request-product.module';
import { TaxModule } from './tax/tax.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CurrencyModule } from './currency/currency.module';
import { ShippingModule } from './shipping/shipping.module';
import { InventoryModule } from './inventory/inventory.module';
import { CartModule } from './cart/cart.module';
import { PricingModule } from './pricing/pricing.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ReturnsModule } from './returns/returns.module';
import { NotificationModule } from './notification/notification.module';
import { CampaignModule } from './campaign/campaign.module';
import { ReportingModule } from './reporting/reporting.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queue/queue.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL || 'mongodb://localhost:27017/ee-commerce'),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        }),
        ttl: 300000,
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'dev-secret'),
      signOptions: { expiresIn: '15m' },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '1025'),
        ignoreTLS: true,
        auth: process.env.EMAIL_USER
          ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
          : undefined,
      },
    }),
    QueueModule,
    UserModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    CouponModule,
    SupplierModule,
    RequestProductModule,
    TaxModule,
    ProductModule,
    ReviewModule,
    CurrencyModule,
    ShippingModule,
    InventoryModule,
    CartModule,
    PricingModule,
    CatalogModule,
    OrderModule,
    PaymentModule,
    ReturnsModule,
    NotificationModule,
    CampaignModule,
    ReportingModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
