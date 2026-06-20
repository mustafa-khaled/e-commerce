import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from '@/coupon/coupon.schema';
import { TaxClass, TaxRule } from '@/tax/tax.schema';
import { Category, CategoryDocument } from '@/category/category.schema';
import { Product, ProductDocument } from '@/product/product.schema';
import { ShippingService } from '@/shipping/shipping.service';
import { CurrencyService } from '@/currency/currency.service';

export interface PricingLineItem {
  productId: string;
  variantSku?: string;
  quantity: number;
  unitPrice: number;
  title: string;
}

export interface PricingInput {
  items: PricingLineItem[];
  couponCode?: string;
  shippingMethodId?: string;
  country: string;
  city?: string;
  currency?: string;
}

export interface PricingResult {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  couponApplied?: string;
}

@Injectable()
export class PricingService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
    @InjectModel(TaxRule.name) private taxModel: Model<TaxRule>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private shippingService: ShippingService,
    private currencyService: CurrencyService,
  ) {}

  async calculate(input: PricingInput): Promise<PricingResult> {
    const currency = input.currency || 'EGP';
    let subtotal = 0;
    let tax = 0;

    for (const item of input.items) {
      const lineTotal = item.unitPrice * item.quantity;
      subtotal += lineTotal;

      const product = await this.productModel.findById(item.productId).populate('category');
      if (product?.category) {
        const category = await this.categoryModel.findById(product.category).populate('taxRule');
        if (category?.taxRule) {
          const taxRule = await this.taxModel.findById(category.taxRule);
          if (taxRule?.isActive) {
            tax += (lineTotal * taxRule.rate) / 100;
          }
        } else {
          const defaultTax = await this.taxModel.findOne({ taxClass: TaxClass.STANDARD, isActive: true });
          if (defaultTax) tax += (lineTotal * defaultTax.rate) / 100;
        }
      }
    }

    let discount = 0;
    let couponApplied: string | undefined;
    if (input.couponCode) {
      const coupon = await this.couponModel.findOne({
        name: input.couponCode,
        expiryDate: { $gte: new Date() },
      });
      if (coupon) {
        discount = (subtotal * coupon.discount) / 100;
        couponApplied = coupon.name;
      }
    }

    let shipping = 0;
    if (input.shippingMethodId) {
      shipping = await this.shippingService.resolveCost(
        input.shippingMethodId,
        subtotal - discount,
      );
    }

    const totalBeforeFx = subtotal - discount + tax + shipping;
    const total =
      currency === 'EGP'
        ? totalBeforeFx
        : this.currencyService.convert(totalBeforeFx, currency);

    return {
      subtotal: currency === 'EGP' ? subtotal : this.currencyService.convert(subtotal, currency),
      discount: currency === 'EGP' ? discount : this.currencyService.convert(discount, currency),
      tax: currency === 'EGP' ? tax : this.currencyService.convert(tax, currency),
      shipping: currency === 'EGP' ? shipping : this.currencyService.convert(shipping, currency),
      total,
      currency,
      couponApplied,
    };
  }
}
