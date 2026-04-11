import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsUrl()
  imageCover: string;

  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  images: string[];

  @IsNumber()
  @IsOptional()
  sold: number;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  priceAfterDiscount: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  colors: string[];

  @IsMongoId()
  category: string;

  @IsMongoId()
  @IsOptional()
  subCategory?: string;

  @IsMongoId()
  @IsOptional()
  brand?: string;
}
