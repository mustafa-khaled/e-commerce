import { IsMongoId, IsString, Length } from 'class-validator';

export class CreateSubCategoryDto {
  @Length(3, 30)
  @IsString()
  name: string;

  @IsMongoId()
  category: string;
}
