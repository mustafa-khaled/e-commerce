import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  website: string;
}
