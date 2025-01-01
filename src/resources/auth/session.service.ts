import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import config from 'src/config';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  private generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  private getExpirationDate(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    return expiresAt;
  }

  setSessionCookie(res: Response, token: string) {
    res.cookie('session_id', token, config.cookies);
  }

  clearSessionCookie(res: Response) {
    const clearCookieOptions = { ...config.cookies };
    delete clearCookieOptions.expires; // Remove the expires option for clearCookie

    res.clearCookie('session_id', clearCookieOptions);
  }

  async createSession(userId: number) {
    const token = this.generateSessionToken();
    const expiresAt = this.getExpirationDate();

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
      throw new NotFoundException('Session not found');
    }

    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async deleteSession(token: string) {
    await this.findSession(token);

    return this.prisma.session.delete({
      where: { token },
    });
  }

  async refreshSession(token: string) {
    return await this.prisma.$transaction(async (tx) => {
      const session = await tx.session.findUnique({
        where: { token },
      });

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      await tx.session.delete({
        where: { token },
      });

      return await tx.session.create({
        data: {
          token: this.generateSessionToken(),
          userId: session.userId,
          expiresAt: this.getExpirationDate(),
        },
      });
    });
  }

  async validateSession(token: string) {
    const session = await this.findSession(token);

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      await this.deleteSession(token);
      return null;
    }

    return session;
  }
}
