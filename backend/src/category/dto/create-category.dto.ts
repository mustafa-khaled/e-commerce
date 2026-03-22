import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}
