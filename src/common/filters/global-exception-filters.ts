import {
  HttpException,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { StandardLoggerService } from 'src/logger/logger.service';
import { Prisma } from 'generated/prisma';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: StandardLoggerService) {}

  private handlePrismaException(
    exception: Prisma.PrismaClientKnownRequestError,
  ) {
    // Handle unique constraint violations
    if (exception.code === 'P2002') {
      const field = (exception.meta?.target as string[])?.join(', ');
      return {
        status: HttpStatus.CONFLICT,
        message: `Unique constraint violation on: ${field}`,
      };
    }

    // Handle foreign key constraint violations
    if (exception.code === 'P2003') {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Related record not found',
      };
    }

    // Handle record not found
    if (exception.code === 'P2025') {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Record not found',
      };
    }

    // Handle invalid data
    if (exception.code === 'P2000') {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid data provided',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database operation failed',
    };
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    const path = request.url;

    let status: number;
    let message: string | object;

    // Handle different types of exceptions
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaException(exception);
      status = prismaError.status;
      message = prismaError.message;
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data format';
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database connection failed';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof TypeError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Type error occurred';
    } else if (exception instanceof SyntaxError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid syntax';
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = {
        error: 'Internal server error',
        detail: exception.message,
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    const logContext = 'GlobalExceptionFilter';
    this.logger.error(
      `Exception Caught : ${JSON.stringify({
        path,
        status,
        message,
        exception: exception instanceof Error ? exception.message : exception,
      })}`,
      exception instanceof Error ? exception.stack : undefined,
      logContext,
    );

    response.status(status).json({
      statusCode: status,
      timestamp,
      path,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    });
  }
}
