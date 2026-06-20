import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { GuestOrJwtGuard } from '@/common/guards/guest-or-jwt.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser, GuestId } from '@/common/decorators/request.decorators';
import { AuthUser } from '@/common/interfaces/auth-user.interface';
import { setGuestCookie, GUEST_COOKIE } from '@/auth/auth-cookie.util';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('guest')
  async createGuestCart(@Res({ passthrough: true }) res) {
    const { cart, guestId } = await this.cartService.getOrCreateGuestCart();
    setGuestCookie(res, guestId);
    return { message: 'Guest cart created', data: cart, guestId };
  }

  @Get()
  @UseGuards(GuestOrJwtGuard)
  async getCart(@CurrentUser() user?: AuthUser, @GuestId() guestId?: string) {
    const cart = await this.cartService.getCart(user?._id, guestId);
    return { message: 'Cart fetched', data: cart };
  }

  @Post('items')
  @UseGuards(GuestOrJwtGuard)
  async addItem(
    @Body() body: { cartId: string; productId: string; quantity: number; variantSku?: string },
  ) {
    const cart = await this.cartService.addItem(
      body.cartId,
      body.productId,
      body.quantity,
      body.variantSku,
    );
    return { message: 'Item added', data: cart };
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  async merge(
    @CurrentUser() user: AuthUser,
    @Req() req: { cookies?: Record<string, string> },
  ) {
    const guestId = req.cookies?.[GUEST_COOKIE];
    if (!guestId) {
      throw new UnauthorizedException('Guest cart not found');
    }
    const cart = await this.cartService.mergeGuestToUser(guestId, user._id);
    return { message: 'Cart merged', data: cart };
  }
}
