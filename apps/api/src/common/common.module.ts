import { Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { GuestOrJwtGuard } from './guards/guest-or-jwt.guard';
import { AuthGuard } from '@/user/guard/auth.guard';

@Global()
@Module({
  providers: [JwtAuthGuard, RolesGuard, GuestOrJwtGuard, AuthGuard],
  exports: [JwtAuthGuard, RolesGuard, GuestOrJwtGuard, AuthGuard],
})
export class CommonModule {}
