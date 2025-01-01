import { InternalServerErrorException, HttpException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorMessages } from 'src/constants/ErrorMessages';
import { ClsService } from 'nestjs-cls';
import { MyClsStore } from 'src/types/myClsStore';

export class ErrorHandler {
  private static readonly logger = new Logger('ErrorHandler');
  private static cls: ClsService<MyClsStore>;

  public static initialize(cls: ClsService<MyClsStore>) {
    this.cls = cls;
  }

  private static getUserContext(): string {
    try {
      const user = this.cls?.get('user');
      if (!user) return 'No user context available';

      return `
        User Context:
        ------------------------
        User ID: ${user.id || 'N/A'}
        Name: ${user.name || 'N/A'}
        ------------------------`;
    } catch {
      return 'Failed to retrieve user context';
    }
  }

  private static formatPrismaError(error: Prisma.PrismaClientKnownRequestError): string {
    return `
🚨 Prisma Error Details:
------------------------
Error Code: ${error.code}
Name: ${error.name}
Target: ${error?.meta?.target || 'N/A'}
Model: ${error?.meta?.modelName || 'N/A'}
Timestamp: ${new Date().toISOString()}
------------------------
${this.getUserContext()}
------------------------
Stack: ${error.stack}
------------------------
Message: ${error.message}
    `;
  }

  private static formatUnknownError(error: unknown): string {
    return `
❌ Unknown Error Details:
------------------------
Type: ${error?.constructor?.name || 'Unknown'}
Message: ${error instanceof Error ? error.message : String(error)}
Timestamp: ${new Date().toISOString()}
------------------------
${this.getUserContext()}
------------------------
Stack: ${error instanceof Error ? error.stack : 'No stack trace available'}
    `;
  }

  public static handle(error: unknown): never {
    // If it's already an HTTP exception, rethrow it
    if (error instanceof HttpException) {
      throw error;
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(this.formatPrismaError(error));
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_ERROR);
    }

    // Handle unknown errors
    this.logger.error(this.formatUnknownError(error));
    throw new InternalServerErrorException(ErrorMessages.INTERNAL_ERROR);
  }
}

