import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Product, ProductDocument } from '@/product/product.schema';
import { CurrencyService } from '@/currency/currency.service';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private currencyService: CurrencyService,
  ) {}

  private localize(product: ProductDocument, locale: string) {
    const t = product.translations?.[locale];
    return {
      id: product._id,
      slug: product.slug,
      title: t?.title || product.title,
      description: t?.description || product.description,
      price: product.price,
      priceAfterDiscount: product.priceAfterDiscount,
      imageCover: product.imageCover,
      images: product.images,
      ratingsAverage: product.ratingsAverage,
      ratingsQuantity: product.ratingsQuantity,
      variants: product.variants,
      colors: product.colors,
      category: product.category,
      brand: product.brand,
    };
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    keyword?: string;
    locale?: string;
    currency?: string;
  }) {
    const cacheKey = `catalog:products:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const page = query.page || 1;
    const limit = query.limit || 12;
    const filter: Record<string, unknown> = { isActive: true };

    if (query.keyword) {
      filter.$text = { $search: query.keyword };
    }

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category', 'name')
        .populate('brand', 'name'),
      this.productModel.countDocuments(filter),
    ]);

    const currency = query.currency || 'EGP';
    const locale = query.locale || 'ar';

    const data = products.map((p) => {
      const localized = this.localize(p, locale);
      if (currency !== 'EGP') {
        localized.price = this.currencyService.convert(localized.price, currency);
        if (localized.priceAfterDiscount) {
          localized.priceAfterDiscount = this.currencyService.convert(
            localized.priceAfterDiscount,
            currency,
          );
        }
      }
      return localized;
    });

    const result = {
      message: 'Products fetched',
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async findBySlug(slug: string, locale = 'ar', currency = 'EGP') {
    const cacheKey = `catalog:product:${slug}:${locale}:${currency}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const product = await this.productModel
      .findOne({ slug, isActive: true })
      .populate('category', 'name')
      .populate('brand', 'name');

    if (!product) return { message: 'Product not found', data: null };

    const localized = this.localize(product, locale);
    if (currency !== 'EGP') {
      localized.price = this.currencyService.convert(localized.price, currency);
    }

    const result = { message: 'Product fetched', data: localized };
    await this.cacheManager.set(cacheKey, result, 600000);
    return result;
  }
}
