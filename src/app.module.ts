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
import { PROVIDERS } from './providers';

@Module({
  imports: [
    ConfigModule.forRoot(config.dotEnv),
    RateLimiter.forRoot(config.rateLimiter),
    GlobalClsModule,
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  providers: PROVIDERS,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
