import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ThrottlerModule as RateLimiter, ThrottlerGuard } from '@nestjs/throttler';
import { config } from './config';
import { UserModule } from './resources/user/user.module';
import { AuthModule } from './resources/auth/auth.module';
import { PrismaModule } from './resources/prisma/prisma.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { GlobalClsModule } from './resources/cls/cls.module';

@Module({
  imports: [
    // .env file configuration
    ConfigModule.forRoot(config.dotEnv),
    // Rate limiter configuration
    RateLimiter.forRoot(config.rateLimiter),
    // Global modules
    GlobalClsModule,
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
