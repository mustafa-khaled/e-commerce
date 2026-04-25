import {
  IsOptional,
  IsMongoId,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class QueryReviewDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  product?: string;

  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
