import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    /**
     * https://docs.nestjs.com/exception-filters
     * http, socket, gRPC 등에 대응 가능 하도록 httpAdapterHost의 adapter 사용
     */
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errorMessage = (exception as any)?.message || 'Internal server error';
    const errorStack = (exception as any)?.stack || 'Error stack not found';
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const timestamp = new Date().toISOString();

    this.logger.error(`
    Status: ${httpStatus}
    Message: ${errorMessage}
    Timestamp: ${timestamp}
    Path: ${request.url}
    Stack: ${errorStack}
    `);

    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage,
      timestamp: timestamp,
      path: httpAdapter.getRequestUrl(request),
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
