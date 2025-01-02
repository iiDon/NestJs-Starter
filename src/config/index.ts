import { ClsConfigService } from '../resources/cls/cls.service';
import { cookiesConfig } from './cookies';
import { DotEnvConfig } from './dotenv';
import { globalPipes } from './globalPipes';
import { RateLimiterConfig } from './rateLimiter';

export const config = {
  cls: (clsConfigService: ClsConfigService) => clsConfigService.createClsConfig(),
  dotEnv: DotEnvConfig,
  rateLimiter: RateLimiterConfig,
  cookies: cookiesConfig,
  globalPipes: globalPipes,
};

export default config;
