import {
  HttpException,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { StandardLoggerService } from 'src/logger/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: StandardLoggerService) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    const path = request.url;

    let status: number;
    let message: string | object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }
    const logContext = 'GlobalExceptionFilter';
    this.logger.error(
      `Exception Caught : ${JSON.stringify(exception)}`,
      exception instanceof Error ? exception.stack : undefined,
      logContext,
    );

    response.status(status).json({
      statusCode: status,
      timestamp,
      path,
      message,
    });
  }
}
