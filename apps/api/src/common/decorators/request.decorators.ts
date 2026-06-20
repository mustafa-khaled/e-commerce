import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '@/common/interfaces/auth-user.interface';
import { AuthenticatedRequest } from '@/common/guards/jwt-auth.guard';
import { GUEST_COOKIE } from '@/auth/auth-cookie.util';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);

export const GuestId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<
      Request & { guestId?: string; cookies?: Record<string, string> }
    >();
    return (
      request.guestId ??
      (request.cookies?.[GUEST_COOKIE] as string | undefined) ??
      (request.headers['x-guest-id'] as string | undefined)
    );
  },
);

export const IdempotencyKey = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers['idempotency-key'] as string | undefined;
  },
);
