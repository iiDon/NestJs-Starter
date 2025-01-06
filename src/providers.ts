import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

export const PROVIDERS: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  },
];
