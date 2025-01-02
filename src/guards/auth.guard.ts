import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { MyClsStore } from 'src/types/myClsStore';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly clsService: ClsService<MyClsStore>) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // First check if user is authenticated
    if (!this.clsService.get('user.id')) {
      return false;
    }

    // ### Enable this code if you want to check for roles ###
    // // Get the roles from the handler metadata
    // const requiredRoles = Reflect.getMetadata(ROLES_KEY, context.getHandler()) || [];

    // // If no roles are required, allow access
    // if (!requiredRoles.length) {
    //   return true;
    // }

    // // Get user roles from cls store
    // const userRoles = this.clsService.get('user.role') || [];

    // // Check if user has any of the required roles
    // return requiredRoles.some((role) => userRoles.includes(role));

    return true;
  }
}
