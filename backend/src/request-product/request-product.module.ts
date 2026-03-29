import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestProduct, RequestProductSchema } from './request-product.schema';
import { User, UserSchema } from '@/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestProduct.name, schema: RequestProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
