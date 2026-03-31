import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxRule, TaxRuleSchema } from './tax.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TaxRule.name, schema: TaxRuleSchema }])],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}
