import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { MyClsStore } from 'src/types/myClsStore';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly clsService: ClsService<MyClsStore>) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (!this.clsService.get('user.id')) {
      return false;
    }

    return true;
  }
}
