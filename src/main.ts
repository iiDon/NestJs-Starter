import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable helmet for security
  app.use(helmet());

  // all routes will be prefixed with /api/v1
  app.setGlobalPrefix('api/v1');

  // enable cors for the frontend
  app.enableCors({
    origin: process.env.ENV === 'development' ? '*' : [], // allow all origins in development
  });

  // enable DTOs validation for all routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      validateCustomDecorators: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(4444);
}
bootstrap();
