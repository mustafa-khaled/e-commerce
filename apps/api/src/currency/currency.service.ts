import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, ExchangeRate } from './currency.schema';

@Injectable()
export class CurrencyService implements OnModuleInit {
  private rates: Record<string, number> = { EGP: 1, USD: 0.02, EUR: 0.018 };

  constructor(
    @InjectModel(Currency.name) private currencyModel: Model<Currency>,
    @InjectModel(ExchangeRate.name) private rateModel: Model<ExchangeRate>,
  ) {}

  async onModuleInit() {
    const count = await this.currencyModel.countDocuments();
    if (count === 0) {
      await this.currencyModel.insertMany([
        { code: 'EGP', symbol: 'E£', decimals: 2, isDefault: true, isActive: true },
        { code: 'USD', symbol: '$', decimals: 2, isDefault: false, isActive: true },
        { code: 'EUR', symbol: '€', decimals: 2, isDefault: false, isActive: true },
      ]);
      await this.rateModel.insertMany([
        { base: 'EGP', quote: 'EGP', rate: 1, effectiveAt: new Date() },
        { base: 'EGP', quote: 'USD', rate: 0.02, effectiveAt: new Date() },
        { base: 'EGP', quote: 'EUR', rate: 0.018, effectiveAt: new Date() },
      ]);
    }
    await this.refreshRates();
  }

  private async refreshRates() {
    const rates = await this.rateModel.find({ base: 'EGP' }).sort({ effectiveAt: -1 });
    for (const r of rates) {
      if (!this.rates[r.quote]) {
        this.rates[r.quote] = r.rate;
      }
    }
  }

  async findAll() {
    const currencies = await this.currencyModel.find({ isActive: true });
    return { message: 'Currencies fetched', data: currencies };
  }

  async getRate(quote: string) {
    const rate = await this.rateModel
      .findOne({ base: 'EGP', quote: quote.toUpperCase() })
      .sort({ effectiveAt: -1 });
    return rate?.rate ?? 1;
  }

  convert(amountEgp: number, toCurrency: string) {
    if (toCurrency === 'EGP') return amountEgp;
    const rate = this.rates[toCurrency.toUpperCase()] ?? 1;
    return Math.round(amountEgp * rate * 100) / 100;
  }
}
