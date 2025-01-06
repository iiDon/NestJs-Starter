import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import config from 'src/config';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  setSessionCookie(res: Response, token: string) {
    res.cookie('session_id', token, config.cookies);
  }

  async createSession(userId: number) {
    const token = this.generateSessionToken();
    const expiresAt = config.cookies.expires;

    const session = await this.prisma.session.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return session;
  }

  async findSession(token: string) {
    if (!token) {
      throw new NotFoundException('لم يتم العثور على الجلسة');
    }

    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      throw new NotFoundException('لم يتم العثور على الجلسة أو انتهت صلاحيتها');
    }

    return session;
  }

  async deleteSession(token: string) {
    await this.findSession(token);

    return this.prisma.session.delete({
      where: { token },
    });
  }

  clearSessionCookie(res: Response) {
    const clearCookieOptions = { ...config.cookies };
    delete clearCookieOptions.expires; // Remove the expires option for clearCookie

    res.clearCookie('session_id', clearCookieOptions);
  }

  private generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }
}
