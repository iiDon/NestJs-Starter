import { Injectable, CanActivate, UnauthorizedException, Type, mixin, ForbiddenException } from '@nestjs/common';
import { ROLE } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { MyClsStore } from 'src/types/myClsStore';

export function AuthRoleGuard(roles: ROLE[] = []): Type<CanActivate> {
  @Injectable()
  class AuthRoleGuardMixin implements CanActivate {
    constructor(private readonly clsService: ClsService<MyClsStore>) {}

    private checkSession = () => {
      const { user, session } = this.clsService.get();
      if (!user || !session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('يجب تسجيل الدخول أولاً');
      }
    };

    private checkRole(): boolean {
      if (roles.length === 0) {
        return true;
      }

      const userRole = this.clsService.get('user.role');

      if (!userRole) {
        throw new ForbiddenException('ليس لديك الصلاحية للوصول إلى هذا المصدر');
      }

      return true;
    }

    async canActivate(): Promise<boolean> {
      try {
        this.checkSession();
        return this.checkRole();
      } catch (error) {
        throw error;
      }
    }
  }

  return mixin(AuthRoleGuardMixin);
}
