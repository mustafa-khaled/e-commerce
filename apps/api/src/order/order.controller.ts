import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GuestOrJwtGuard } from '@/common/guards/guest-or-jwt.guard';
import { CurrentUser, IdempotencyKey } from '@/common/decorators/request.decorators';
import { AuthUser } from '@/common/interfaces/auth-user.interface';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(GuestOrJwtGuard)
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user?: AuthUser,
    @IdempotencyKey() idempotencyKey?: string,
  ) {
    return this.orderService.create(dto, user?._id, idempotencyKey);
  }

  @Get('track')
  track(@Query('orderNumber') orderNumber: string, @Query('email') email: string) {
    return this.orderService.track(orderNumber, email);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findMine(@CurrentUser() user: AuthUser) {
    return this.orderService.findByUser(user._id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.orderService.findOne(id, user._id);
  }
}
