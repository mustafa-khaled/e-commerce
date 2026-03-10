import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UserRole } from '@/user/enums/user-role.enum';

export class QueryUserDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
