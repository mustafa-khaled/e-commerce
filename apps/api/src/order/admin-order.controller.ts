import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '@/order/order.schema';
import { OrderService } from '@/order/order.service';
import { AuthGuard } from '@/user/guard/auth.guard';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { OrderStatus } from '@ee/shared-types';

@ApiTags('admin-orders')
@Controller('admin/orders')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AdminOrderController {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private orderService: OrderService,
  ) {}

  @Get()
  @Roles([UserRole.ADMIN, UserRole.SUPPORT])
  async findAll(@Query('status') status?: OrderStatus) {
    const filter = status ? { status } : {};
    const orders = await this.orderModel.find(filter).sort({ createdAt: -1 }).limit(100);
    return { message: 'Orders fetched', data: orders };
  }

  @Patch(':id/status')
  @Roles([UserRole.ADMIN, UserRole.SUPPORT])
  updateStatus(@Param('id') id: string, @Body() body: { status: OrderStatus }) {
    return this.orderService.updateStatus(id, body.status);
  }
}
