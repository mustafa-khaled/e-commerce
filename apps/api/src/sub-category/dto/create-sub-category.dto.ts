import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  category: string;
}
