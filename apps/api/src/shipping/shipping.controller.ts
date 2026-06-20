import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';

@ApiTags('shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('zones/:countryCode/methods')
  getMethods(
    @Param('countryCode') countryCode: string,
    @Query('subtotal') subtotal: string,
    @Query('city') city?: string,
  ) {
    return this.shippingService.getMethodsForCountry(
      countryCode,
      parseFloat(subtotal || '0'),
      city,
    );
  }
}
