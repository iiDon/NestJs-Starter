import { ClsStore } from 'nestjs-cls';
import { User } from '@prisma/client';

export interface MyClsStore extends ClsStore {
  user: Omit<User, 'password'> & { session_id: string };
}
