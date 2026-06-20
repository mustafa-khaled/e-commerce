import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { GuestOrJwtGuard } from '@/common/guards/guest-or-jwt.guard';
import { AuthGuard } from '@/user/guard/auth.guard';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { ReturnStatus } from '@ee/shared-types';
import { CurrentUser } from '@/common/decorators/request.decorators';
import { AuthUser } from '@/common/interfaces/auth-user.interface';

@ApiTags('returns')
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @UseGuards(GuestOrJwtGuard)
  create(
    @Body()
    body: {
      orderNumber: string;
      email?: string;
      items: { productId: string; variantSku?: string; quantity: number; reason: string }[];
    },
    @CurrentUser() user?: AuthUser,
  ) {
    return this.returnsService.create({ ...body, userId: user?._id, email: body.email });
  }

  @Get('order/:orderId')
  @UseGuards(AuthGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPPORT, UserRole.CUSTOMER])
  @ApiBearerAuth()
  findByOrder(@Param('orderId') orderId: string) {
    return this.returnsService.findByOrder(orderId);
  }
}

@ApiTags('admin-returns')
@Controller('admin/returns')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AdminReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Get()
  @Roles([UserRole.ADMIN, UserRole.SUPPORT])
  findAll(@Query('status') status?: ReturnStatus) {
    return this.returnsService.findAll(status);
  }

  @Patch(':id/status')
  @Roles([UserRole.ADMIN, UserRole.SUPPORT])
  updateStatus(@Param('id') id: string, @Body() body: { status: ReturnStatus }) {
    return this.returnsService.updateStatus(id, body.status);
  }
}
