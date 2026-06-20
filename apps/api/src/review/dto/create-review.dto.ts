import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsMongoId()
  @IsNotEmpty()
  product: Types.ObjectId;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
