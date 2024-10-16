import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  ThrottlerModule as RateLimiter,
  ThrottlerGuard,
} from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
import { config } from './config';
import { UserModule } from './resources/user/user.module';
import { AuthModule } from './resources/auth/auth.module';
import { PrismaModule } from './resources/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // Enable .env file for the entire application
    ConfigModule.forRoot(config.dotEnv),
    // Enable rate limiting for the entire application
    RateLimiter.forRoot(config.rateLimiter),
    // Enable cls for the entire application
    ClsModule.forRoot(config.cls),
    // Import AuthModule and UserModule
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [], // Remove AuthModule and UserModule from here
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
