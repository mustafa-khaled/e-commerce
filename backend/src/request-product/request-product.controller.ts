import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { AuthGuard } from '@/user/guard/auth.guard';

@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Get()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard)
  findAll() {
    return this.requestProductService.findAll();
  }

  @Get(':id')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.requestProductService.findOne(id);
  }

  @Post()
  @Roles([UserRole.USER])
  @UseGuards(AuthGuard)
  create(@Body() createRequestProductDto: CreateRequestProductDto, @Req() req) {
    if (req.user.role !== UserRole.USER) {
      throw new ForbiddenException(
        'You are not authorized to create a request product',
      );
    }

    return this.requestProductService.create(
      createRequestProductDto,
      req.user._id,
    );
  }

  @Patch(':id')
  @Roles([UserRole.USER])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
  ) {
    return this.requestProductService.update(id, updateRequestProductDto);
  }

  @Delete(':id')
  @Roles([UserRole.USER])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.requestProductService.remove(id);
  }
}
