import { CacheModuleOptions } from '@nestjs/cache-manager';

export const cacheConfig: CacheModuleOptions = {
  isGlobal: true,
  ttl: 300000, // 5 minutes in milliseconds for cache-manager v5
  store: 'memory',
};
