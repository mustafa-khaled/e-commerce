import {
  IsOptional,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@/common/dto/pagination.dto';

class NumberFilter {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gte?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lte?: number;
}

export class QueryProductDto extends PaginationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFilter)
  price?: NumberFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFilter)
  sold?: NumberFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFilter)
  ratingAverage?: NumberFilter;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
