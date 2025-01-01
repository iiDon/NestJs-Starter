import { ValidationPipe } from '@nestjs/common';

export const globalPipes = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  disableErrorMessages: false,
  validateCustomDecorators: true,
  transformOptions: { enableImplicitConversion: true },
});
