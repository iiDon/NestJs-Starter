import { ClsStore } from 'nestjs-cls';
import { JWTPayload } from './auth.type';

export interface MyClsStore extends ClsStore {
  user: JWTPayload | null;
}
