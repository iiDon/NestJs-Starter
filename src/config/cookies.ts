import { CookieOptions } from 'express';

export const cookiesConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.ENV === 'production',
  sameSite: 'strict',
  expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now (You can set it on .env file)
};
