import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { StructuredResponse } from 'src/global/types';

@Injectable()
export class ResponseInterceptor<T extends object>
  implements NestInterceptor<T, StructuredResponse<Omit<T, 'message'>>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StructuredResponse<Omit<T, 'message'>>> {
    const ctx = context.switchToHttp().getResponse();
    const statusCode = ctx.statusCode;
    return next.handle().pipe(
      map((data) => {
        let cleanData = data;
        if (typeof data === 'object' && data !== null && 'message' in data) {
          // Remove the message property from data
          const { message, ...rest } = data as any;
          cleanData = rest;
        }
        return {
          data: cleanData,
          message:
            typeof data === 'object' && data !== null && 'message' in data
              ? ((data as any).message as string)
              : 'Request successfull',
          success: true,
          timestamp: new Date().toISOString(),
          statusCode,
        };
      }),
    );
  }
}
