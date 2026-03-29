import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier, SupplierDocument } from './supplier.schema';
import { Model } from 'mongoose';
import { findDocumentById } from '@/common/utils/find-by-id.util';
import { escapeRegex } from '@/common/utils/escape-regex.util';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private readonly supplierModel: Model<SupplierDocument>,
  ) {}

  async findAll() {
    const suppliers = await this.supplierModel.find();

    return {
      message: 'Suppliers fetched successfully',
      results: suppliers.length,
      data: suppliers,
    };
  }

  async findOne(id: string) {
    const supplier = await findDocumentById(this.supplierModel, id, 'Supplier');

    return {
      message: 'Supplier fetched successfully',
      data: supplier,
    };
  }

  async create(createSupplierDto: CreateSupplierDto) {
    const isExist = await this.supplierModel.findOne({
      name: {
        $regex: `^${escapeRegex(createSupplierDto.name)}$`,
        $options: 'i',
      },
    });

    if (isExist) throw new BadRequestException('Supplier already exists');

    const supplier = await this.supplierModel.create(createSupplierDto);

    return {
      message: 'Supplier created successfully',
      data: supplier,
    };
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await findDocumentById(this.supplierModel, id, 'Supplier');

    if (updateSupplierDto.name) {
      const isExist = await this.supplierModel.findOne({
        name: {
          $regex: `^${escapeRegex(updateSupplierDto.name)}$`,
          $options: 'i',
        },
        _id: { $ne: id },
      });
      if (isExist) throw new BadRequestException('Supplier already exists');
    }

    supplier.name = updateSupplierDto.name ?? supplier.name;
    supplier.website = updateSupplierDto.website ?? supplier.website;

    await supplier.save();

    return {
      message: 'Supplier updated successfully',
      data: supplier,
    };
  }

  async remove(id: string) {
    const supplier = await findDocumentById(this.supplierModel, id, 'Supplier');

    await supplier.deleteOne();

    return {
      message: 'Supplier deleted successfully',
    };
  }
}
