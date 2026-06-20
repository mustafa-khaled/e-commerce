import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './sub-category.schema';
import { CategoryModule } from '@/category/category.module';
import { Category, CategorySchema } from '@/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CategoryModule,
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
