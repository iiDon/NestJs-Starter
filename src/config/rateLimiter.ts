import { type ThrottlerModuleOptions } from '@nestjs/throttler';

export const RateLimiterConfig: ThrottlerModuleOptions = [
  {
    ttl: 60000,
    limit: 5,
  },
];
