import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TaxRule, TaxClass } from './tax.schema';
import { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';

@Injectable()
export class TaxService implements OnModuleInit {
  constructor(
    @InjectModel(TaxRule.name)
    private readonly taxRuleModel: Model<TaxRule>,
  ) {}

  // Automatically seed the database with Egyptian Tax Rules on startup 🇪🇬
  async onModuleInit() {
    const count = await this.taxRuleModel.countDocuments();
    if (count === 0) {
      await this.taxRuleModel.insertMany([
        { name: 'Egypt Standard VAT', taxClass: TaxClass.STANDARD, rate: 14, appliesToShipping: false, isActive: true },
        { name: 'Tax Exempt', taxClass: TaxClass.EXEMPT, rate: 0, appliesToShipping: false, isActive: true },
      ]);
      console.log('🌱 Seeded default tax rules for Egypt.');
    }
  }

  async findAll() {
    const taxes = await this.taxRuleModel.find();
    return {
      message: 'Tax rules fetched successfully',
      results: taxes.length,
      data: taxes,
    };
  }

  async findOne(id: string) {
    const taxRule = await findDocumentById(this.taxRuleModel, id, 'TaxRule');
    return {
      message: 'Tax rule fetched successfully',
      data: taxRule,
    };
  }

  async create(createTaxDto: CreateTaxDto) {
    const isExist = await this.taxRuleModel.findOne({ taxClass: createTaxDto.taxClass });
    if (isExist) throw new BadRequestException(`Tax rule with class "${createTaxDto.taxClass}" already exists`);

    const newTaxRule = await this.taxRuleModel.create(createTaxDto);
    return {
      message: 'Tax rule created successfully',
      data: newTaxRule,
    };
  }

  async update(id: string, updateTaxDto: UpdateTaxDto) {
    if (updateTaxDto.taxClass) {
      const isExist = await this.taxRuleModel.findOne({
        taxClass: updateTaxDto.taxClass,
        _id: { $ne: id },
      });
      if (isExist) throw new BadRequestException(`Tax rule with class "${updateTaxDto.taxClass}" already exists`);
    }

    const taxRule = await this.taxRuleModel.findByIdAndUpdate(
      id,
      updateTaxDto,
      { new: true, runValidators: true },
    );

    if (!taxRule) {
      throw new BadRequestException('Tax rule not found or invalid ID');
    }

    return {
      message: 'Tax rule updated successfully',
      data: taxRule,
    };
  }

  async remove(id: string) {
    const taxRule = await findDocumentById(this.taxRuleModel, id, 'TaxRule');
    
    // We soft delete tax rules, never hard delete, to keep audit logs for existing orders intact
    taxRule.isActive = false;
    await taxRule.save();

    return {
      message: 'Tax rule deactivated successfully',
    };
  }
}
