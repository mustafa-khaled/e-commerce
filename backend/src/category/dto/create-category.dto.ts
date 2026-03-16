import { IsString, IsUrl, Length } from 'class-validator';

export class CreateCategoryDto {
  @Length(3, 30)
  @IsString()
  name: string;

  @IsString()
  @IsUrl()
  image?: string;
}
