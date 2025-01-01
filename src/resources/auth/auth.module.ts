import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { SessionService } from './session.service';

@Module({
  imports: [UserModule],
  providers: [AuthService, SessionService],
  controllers: [AuthController],
  exports: [AuthService, SessionService],
})
export class AuthModule {}
