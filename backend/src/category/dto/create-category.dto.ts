import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateCategoryDto {
  @Length(3, 30)
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}
