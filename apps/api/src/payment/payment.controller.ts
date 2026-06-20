import { Body, Controller, Get, Headers, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { Response } from 'express';
import { PaymentService } from './payment.service';
import { GuestOrJwtGuard } from '@/common/guards/guest-or-jwt.guard';
import { AuthGuard } from '@/user/guard/auth.guard';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { CurrentUser } from '@/common/decorators/request.decorators';
import { AuthUser } from '@/common/interfaces/auth-user.interface';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('kashier/session')
  @UseGuards(GuestOrJwtGuard)
  createSession(
    @Body() body: { orderId: string; redirectUrl: string },
    @CurrentUser() user?: AuthUser,
    @Req() req?: Request & { guestId?: string },
  ) {
    return this.paymentService.createKashierSession(
      body.orderId,
      body.redirectUrl,
      user?._id,
      req?.guestId,
    );
  }

  @Post('kashier/webhook')
  webhook(
    @Body() body: Record<string, unknown>,
    @Headers('x-kashier-signature') signature: string,
  ) {
    return this.paymentService.handleKashierWebhook(body, signature);
  }

  @Get('kashier/callback')
  async callback(
    @Query('orderId') orderId: string,
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    const redirectUrl = await this.paymentService.handleKashierCallback(orderId, status);
    return res.redirect(redirectUrl);
  }

  @Post('cod/confirm')
  @UseGuards(AuthGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPPORT])
  confirmCod(@Body() body: { orderId: string }) {
    return this.paymentService.confirmCod(body.orderId);
  }
}
