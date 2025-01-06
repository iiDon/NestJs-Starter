import { ClsStore } from 'nestjs-cls';
import { User } from '@prisma/client';

export interface MyClsStore extends ClsStore {
  user: Pick<User, 'id' | 'name' | 'email' | 'role'> | null;
  session: { token: string; expiresAt: Date } | null;
}
