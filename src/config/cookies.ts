import { CookieOptions } from 'express';

// cookiesConfig for setting cookies
export const cookiesConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
};
