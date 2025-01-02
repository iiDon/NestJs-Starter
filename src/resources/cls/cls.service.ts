import { ClsService, type ClsModuleOptions } from 'nestjs-cls';
import { MyClsStore } from 'src/types/myClsStore';
import { Injectable } from '@nestjs/common';
import { SessionService } from '../auth/session.service';

@Injectable()
export class ClsConfigService {
  constructor(private readonly sessionService: SessionService) {}

  createClsConfig(): ClsModuleOptions {
    return {
      global: true,
      middleware: {
        mount: true,
        setup: async (cls: ClsService<MyClsStore>, req) => {
          try {
            const sessionId = req.cookies['session_id'];
            if (!sessionId) {
              return;
            }

            const { user } = await this.sessionService.findSession(sessionId);
            if (user) {
              cls.set('user', {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                session_id: sessionId,
              });
            }
          } catch (error) {
            console.error('Error setting up CLS middleware:', error);
          }
        },
      },
    };
  }
}
