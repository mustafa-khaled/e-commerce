import { IsDateString, IsNumber, Length, Max, Min } from 'class-validator';

export class CreateCouponDto {
  @Length(3, 100)
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @IsDateString()
  expiryDate: Date;
}
