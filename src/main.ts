import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable helmet for security
  app.use(helmet());

  // all routes will be prefixed with /api/v1
  app.setGlobalPrefix('api/v1');

  // enable cors for the frontend
  app.enableCors({
    origin: process.env.ENV === 'development' ? '*' : [], // allow all origins in development
    credentials: true,
  });

  // enable DTOs validation for all routes
  app.useGlobalPipes(config.globalPipes);

  await app.listen(4444);
}
bootstrap();
