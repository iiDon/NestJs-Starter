// src/common/filters/global-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { MyClsStore } from 'src/types/myClsStore';
import { ErrorHandler } from 'src/utils/throwError';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly cls: ClsService<MyClsStore>) {
    ErrorHandler.initialize(this.cls);
  }

  catch(error: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    try {
      ErrorHandler.handle(error);
    } catch (handledError) {
      const status = handledError instanceof HttpException ? handledError.getStatus() : 500;

      let responseBody: any;
      if (handledError instanceof HttpException) {
        const response = handledError.getResponse();
        responseBody = {
          message: typeof response === 'string' ? response : response['message'] || 'An error occurred',
          error: handledError.name,
          statusCode: status,
        };
      } else {
        responseBody = {
          message: 'Internal server error',
          error: 'InternalServerError',
          statusCode: status,
        };
      }

      response.status(status).json(responseBody);
    }
  }
}
