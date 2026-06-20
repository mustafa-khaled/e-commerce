import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PricingService } from './pricing.service';

@ApiTags('checkout')
@Controller('checkout')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('preview')
  preview(@Body() body: Parameters<PricingService['calculate']>[0]) {
    return this.pricingService.calculate(body).then((data) => ({
      message: 'Checkout preview',
      data,
    }));
  }
}
