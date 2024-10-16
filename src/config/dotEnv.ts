import { type ConfigModuleOptions } from '@nestjs/config';

export const DotEnvConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
  ignoreEnvFile: false,
};
