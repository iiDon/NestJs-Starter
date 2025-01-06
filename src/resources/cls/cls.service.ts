import { ClsService, type ClsModuleOptions } from 'nestjs-cls';
import { MyClsStore } from 'src/types/myClsStore';
import { Injectable } from '@nestjs/common';
import { SessionService } from '../auth/session.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClsConfigService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly prismaService: PrismaService,
  ) {}

  createClsConfig(): ClsModuleOptions {
    return {
      global: true,
      middleware: {
        mount: true,
        setup: async (cls: ClsService<MyClsStore>, req) => {
          const sessionId = req.cookies['session_id'];
          if (!sessionId) {
            cls.set('user', null);
            cls.set('session', null);
            return;
          }

          const session = await this.prismaService.session.findUnique({
            where: {
              token: sessionId,
              expiresAt: {
                gte: new Date(),
              },
            },
            include: { user: true },
          });

          cls.set('user', {
            id: session?.user.id,
            name: session?.user.name,
            email: session?.user.email,
            role: session?.user.role,
          });
          cls.set('session', {
            token: sessionId,
            expiresAt: session?.expiresAt,
          });

          return;
        },
      },
    };
  }
}
