// src/common/filters/global-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { MyClsStore } from 'src/types/myClsStore';
import { ErrorHandler } from 'src/utils/throwError';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly cls: ClsService<MyClsStore>) {
    ErrorHandler.initialize(cls);
  }

  catch(error: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    try {
      ErrorHandler.handle(error);
    } catch (handledError) {
      const status = handledError instanceof HttpException ? handledError.getStatus() : 500;

      const responseBody =
        handledError instanceof HttpException ? handledError.getResponse() : { message: 'Internal server error' };

      response.status(status).json(responseBody);
    }
  }
}
