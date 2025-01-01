import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ClsConfigService } from './cls.service';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    AuthModule,
    ClsModule.forRootAsync({
      imports: [AuthModule],
      useFactory: (clsConfigService: ClsConfigService) => {
        return clsConfigService.createClsConfig();
      },
      inject: [ClsConfigService],
    }),
  ],
  providers: [ClsConfigService],
  exports: [ClsModule, ClsConfigService],
})
export class GlobalClsModule {}
