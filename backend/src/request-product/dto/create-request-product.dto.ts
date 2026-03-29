import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRequestProductDto {
  @IsString()
  titleNeed: string;

  @IsString()
  @MinLength(5)
  details: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  category: string;

  @IsString()
  @IsMongoId()
  user: string;
}
