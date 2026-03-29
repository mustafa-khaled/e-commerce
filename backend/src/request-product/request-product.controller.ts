import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { AuthGuard } from '@/user/guard/auth.guard';

@Controller('request-product')
@UseGuards(AuthGuard)
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Post()
  @Roles([UserRole.USER])
  create(@Body() createRequestProductDto: CreateRequestProductDto) {
    return this.requestProductService.create(createRequestProductDto);
  }

  @Get()
  @Roles([UserRole.ADMIN])
  findAll() {
    return this.requestProductService.findAll();
  }

  @Get(':id')
  @Roles([UserRole.ADMIN])
  findOne(@Param('id') id: string) {
    return this.requestProductService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.USER])
  update(
    @Param('id') id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
  ) {
    return this.requestProductService.update(id, updateRequestProductDto);
  }

  @Delete(':id')
  @Roles([UserRole.USER])
  remove(@Param('id') id: string) {
    return this.requestProductService.remove(id);
  }
}
