import { Controller, Get, Param, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@/user/guard/auth.guard';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';

@ApiTags('inventory')
@Controller('admin/inventory')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('products/:id')
  @Roles([UserRole.ADMIN, UserRole.INVENTORY])
  async getProductInventory(@Param('id') id: string) {
    const available = await this.inventoryService.getAvailable(id);
    return { message: 'Inventory status', data: { productId: id, available } };
  }

  @Get('low-stock')
  @Roles([UserRole.ADMIN, UserRole.INVENTORY])
  async getLowStock(@Query('threshold') threshold?: string) {
    const data = await this.inventoryService.getLowStock(
      threshold ? parseInt(threshold, 10) : 10,
    );
    return { message: 'Low stock', data };
  }

  @Post('adjustments')
  @Roles([UserRole.ADMIN, UserRole.INVENTORY])
  async adjust(
    @Body() body: { productId: string; delta: number; reason: string; variantSku?: string },
  ) {
    const data = await this.inventoryService.adjustStock(
      body.productId,
      body.delta,
      body.reason,
      body.variantSku,
    );
    return { message: 'Adjustment recorded', data };
  }
}
