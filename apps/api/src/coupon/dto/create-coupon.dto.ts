import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  Length,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfterToday', async: false })
export class IsAfterTodayConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    return new Date(value) >= today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The expiry date must be today or in the future';
  }
}

export class CreateCouponDto {
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @IsNotEmpty()
  @IsDateString()
  @Validate(IsAfterTodayConstraint)
  expiryDate: string;
}
