import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const Bearer = (request.headers['authorization'] ||
      request.headers['Authorization']) as string;

    const token = Bearer.replace('Bearer ', '');
    return token;
  },
);
