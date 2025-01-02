import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'src/types/auth.type';

export const ROLES_KEY = 'ROLES';
export const Roles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles);
