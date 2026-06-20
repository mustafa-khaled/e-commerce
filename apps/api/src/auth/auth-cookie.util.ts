import { Response } from 'express';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';
const GUEST_COOKIE = 'guest_id';

function cookieOptions(maxAgeMs: number, path = '/') {
  const secure = process.env.COOKIE_SECURE === 'true';
  const sameSite = (process.env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none';
  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure,
    sameSite,
    domain,
    path,
    maxAge: maxAgeMs,
  };
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000, '/api/v1/auth'));
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE, { path: '/', httpOnly: true });
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth', httpOnly: true });
}

export function setGuestCookie(res: Response, guestId: string) {
  res.cookie(GUEST_COOKIE, guestId, cookieOptions(30 * 24 * 60 * 60 * 1000));
}

export { ACCESS_COOKIE, REFRESH_COOKIE, GUEST_COOKIE };
