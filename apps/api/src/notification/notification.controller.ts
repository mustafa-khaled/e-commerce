import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/request.decorators';
import { AuthUser } from '@/common/interfaces/auth-user.interface';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  registerDevice(
    @CurrentUser() user: AuthUser,
    @Body() body: { token: string; platform: string },
  ) {
    return this.notificationService.registerDevice(user._id, body.token, body.platform);
  }
}
