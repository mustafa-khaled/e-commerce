import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Headers('accept-language') locale?: string,
    @Headers('x-currency') currency?: string,
  ) {
    return this.catalogService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12,
      keyword,
      locale: locale?.split(',')[0] || 'ar',
      currency: currency || 'EGP',
    });
  }

  @Get('products/:slug')
  findBySlug(
    @Param('slug') slug: string,
    @Headers('accept-language') locale?: string,
    @Headers('x-currency') currency?: string,
  ) {
    return this.catalogService.findBySlug(
      slug,
      locale?.split(',')[0] || 'ar',
      currency || 'EGP',
    );
  }
}
