import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { AuthGuard } from '@/user/guard/auth.guard';
import { AuthUser } from '@/common/interfaces/auth-user.interface';

@Controller('request-product')
@UseGuards(AuthGuard)
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Get()
  @Roles([UserRole.ADMIN])
  findAll() {
    return this.requestProductService.findAll();
  }

  @Get(':id')
  @Roles([UserRole.ADMIN, UserRole.USER])
  findOne(@Param('id') id: string, @Req() req: { user: AuthUser }) {
    return this.requestProductService.findOne(id, req.user);
  }

  @Post()
  @Roles([UserRole.USER])
  create(
    @Body() createRequestProductDto: CreateRequestProductDto,
    @Req() req: { user: AuthUser },
  ) {
    if (req.user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins cannot create product requests');
    }

    return this.requestProductService.create(
      createRequestProductDto,
      req.user._id,
    );
  }

  @Patch(':id')
  @Roles([UserRole.USER])
  update(
    @Param('id') id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
    @Req() req: { user: AuthUser },
  ) {
    if (req.user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins cannot edit product requests');
    }

    return this.requestProductService.update(
      id,
      updateRequestProductDto,
      req.user._id,
    );
  }

  @Delete(':id')
  @Roles([UserRole.USER])
  remove(@Param('id') id: string, @Req() req: { user: AuthUser }) {
    if (req.user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins cannot delete product requests');
    }

    return this.requestProductService.remove(id, req.user._id);
  }
}
