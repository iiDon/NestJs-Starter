import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Type,
  mixin,
} from '@nestjs/common';
import { ROLE } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { SessionService } from 'src/resources/auth/session.service';
import { MyClsStore } from 'src/types/myClsStore';

export function AuthRoleGuard(roles: ROLE[] = []): Type<CanActivate> {
  @Injectable()
  class AuthRoleGuardMixin implements CanActivate {
    constructor(
      private readonly clsService: ClsService<MyClsStore>,
      private readonly sessionService: SessionService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        const userId = this.clsService.get('user.id');
        if (!userId) {
          throw new UnauthorizedException('يجب تسجيل الدخول أولاً');
        }

        // Refresh the session
        await this.sessionService.refreshSession(this.clsService.get('user.session_id'));

        // If no roles specified, just check authentication
        if (roles.length === 0) {
          return true;
        }

        // Get user role from cls store and check if it matches
        const userRole = this.clsService.get('user.role');
        const hasRole = roles.includes(userRole);

        if (!hasRole) {
          throw new UnauthorizedException(`هذا الإجراء خاص بـ ${roles.join(' أو ')} فقط`);
        }

        return true;
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        }
        // Handle session refresh failure or other errors
        throw new UnauthorizedException('جلستك انتهت. يرجى تسجيل الدخول مرة أخرى');
      }
    }
  }

  return mixin(AuthRoleGuardMixin);
}
