import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  HttpVersionNotSupportedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  ImATeapotException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  PreconditionFailedException,
  HttpException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger('ErrorHandler');

export const throwError = (error: unknown) => {
  if (error instanceof HttpException) {
    // If it's already a NestJS HttpException, rethrow it
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
      case 'P2005':
      case 'P2006':
        throw new BadRequestException(
          'عذرًا، البيانات المدخلة غير صالحة. يرجى التحقق منها وإعادة المحاولة.',
        );
      case 'P2001':
      case 'P2015':
      case 'P2018':
      case 'P2025':
        throw new NotFoundException(
          'عذرًا، لم نتمكن من العثور على المعلومات التي تبحث عنها. يرجى التحقق والمحاولة مرة أخرى.',
        );
      case 'P2002':
        throw new ConflictException(
          'عذرًا، هذه المعلومات موجودة بالفعل. يرجى استخدام بيانات مختلفة.',
        );
      // ... (other Prisma error codes remain the same)
      default:
        logger.error(`Unhandled Prisma error: ${error.code}`, error.stack);
        throw new InternalServerErrorException(
          'عذرًا، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.',
        );
    }
  }

  if (error instanceof Error) {
    switch (error.name) {
      case 'BadRequestException':
        throw new BadRequestException(error.message);
      case 'UnauthorizedException':
        throw new UnauthorizedException(error.message);
      case 'NotFoundException':
        throw new NotFoundException(error.message);
      case 'ForbiddenException':
        throw new ForbiddenException(error.message);
      case 'NotAcceptableException':
        throw new NotAcceptableException(error.message);
      case 'RequestTimeoutException':
        throw new RequestTimeoutException(error.message);
      case 'ConflictException':
        throw new ConflictException(error.message);
      case 'GoneException':
        throw new GoneException(error.message);
      case 'HttpVersionNotSupportedException':
        throw new HttpVersionNotSupportedException(error.message);
      case 'PayloadTooLargeException':
        throw new PayloadTooLargeException(error.message);
      case 'UnsupportedMediaTypeException':
        throw new UnsupportedMediaTypeException(error.message);
      case 'UnprocessableEntityException':
        throw new UnprocessableEntityException(error.message);
      case 'InternalServerErrorException':
        throw new InternalServerErrorException(error.message);
      case 'NotImplementedException':
        throw new NotImplementedException(error.message);
      case 'ImATeapotException':
        throw new ImATeapotException(error.message);
      case 'MethodNotAllowedException':
        throw new MethodNotAllowedException(error.message);
      case 'BadGatewayException':
        throw new BadGatewayException(error.message);
      case 'ServiceUnavailableException':
        throw new ServiceUnavailableException(error.message);
      case 'GatewayTimeoutException':
        throw new GatewayTimeoutException(error.message);
      case 'PreconditionFailedException':
        throw new PreconditionFailedException(error.message);
      default:
        logger.error(`Unhandled error: ${error.name}`, error.stack);
        throw new InternalServerErrorException(
          'عذرًا، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.',
        );
    }
  }

  // If it's not a Prisma error or a known exception type, log and throw a generic error
  logger.error('Unknown error type', error);
  throw new InternalServerErrorException(
    'عذرًا، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.',
  );
};
