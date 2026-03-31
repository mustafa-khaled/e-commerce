import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { TaxClass } from '../tax.schema';

export class CreateTaxDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TaxClass)
  @IsNotEmpty()
  taxClass: TaxClass;

  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @IsBoolean()
  @IsOptional()
  appliesToShipping?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
