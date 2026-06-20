import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingMethod, ShippingZone } from './shipping.schema';

@Injectable()
export class ShippingService implements OnModuleInit {
  constructor(
    @InjectModel(ShippingZone.name) private zoneModel: Model<ShippingZone>,
    @InjectModel(ShippingMethod.name) private methodModel: Model<ShippingMethod>,
  ) {}

  async onModuleInit() {
    const count = await this.zoneModel.countDocuments();
    if (count === 0) {
      const zone = await this.zoneModel.create({
        name: 'Egypt',
        countries: ['EG'],
        isActive: true,
      });
      await this.methodModel.insertMany([
        {
          zoneId: zone._id,
          name: 'Standard Cairo/Giza',
          type: 'flat',
          rules: { rate: 50, cities: ['Cairo', 'Giza'] },
          estimatedDaysMin: 1,
          estimatedDaysMax: 3,
        },
        {
          zoneId: zone._id,
          name: 'Alexandria',
          type: 'flat',
          rules: { rate: 75, cities: ['Alexandria'] },
          estimatedDaysMin: 2,
          estimatedDaysMax: 4,
        },
        {
          zoneId: zone._id,
          name: 'Other Governorates',
          type: 'flat',
          rules: { rate: 100 },
          estimatedDaysMin: 3,
          estimatedDaysMax: 7,
        },
        {
          zoneId: zone._id,
          name: 'Free Shipping',
          type: 'free_over_threshold',
          rules: { rate: 0, freeShippingThreshold: 1000 },
          estimatedDaysMin: 2,
          estimatedDaysMax: 5,
        },
      ]);
    }
  }

  async getMethodsForCountry(countryCode: string, subtotal: number, city?: string) {
    const zone = await this.zoneModel.findOne({
      countries: countryCode.toUpperCase(),
      isActive: true,
    });
    if (!zone) {
      return { message: 'No shipping zone', data: [], cost: 0 };
    }

    const methods = await this.methodModel.find({ zoneId: zone._id, isActive: true });
    const eligible = methods
      .filter((m) => {
        if (m.type === 'free_over_threshold' && subtotal >= (m.rules.freeShippingThreshold ?? 0)) {
          return true;
        }
        if (m.rules.cities?.length && city) {
          return m.rules.cities.some((c) => c.toLowerCase() === city.toLowerCase());
        }
        if (m.type === 'flat' && !m.rules.cities?.length) return true;
        if (m.type === 'flat' && m.rules.cities?.length && city) {
          return m.rules.cities.some((c) => c.toLowerCase() === city.toLowerCase());
        }
        return m.type === 'free_over_threshold' && subtotal < (m.rules.freeShippingThreshold ?? Infinity);
      })
      .map((m) => ({
        id: m._id,
        name: m.name,
        cost: m.type === 'free_over_threshold' && subtotal >= (m.rules.freeShippingThreshold ?? 0) ? 0 : m.rules.rate,
        estimatedDaysMin: m.estimatedDaysMin,
        estimatedDaysMax: m.estimatedDaysMax,
      }));

    return { message: 'Shipping methods', data: eligible };
  }

  async resolveCost(methodId: string, subtotal: number): Promise<number> {
    const method = await this.methodModel.findById(methodId);
    if (!method) return 0;
    if (method.type === 'free_over_threshold' && subtotal >= (method.rules.freeShippingThreshold ?? 0)) {
      return 0;
    }
    return method.rules.rate;
  }
}
