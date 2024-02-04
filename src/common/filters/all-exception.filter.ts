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
import ErrorResponseType from './error-response-type';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const exception_response =
      exception.getResponse() as HttpException['response'];

    const message = exception_response?.message || '';
    const error = exception_response?.error || 'Internal server error';
    const stack = exception_response?.stack || 'Error stack not found';
    const httpStatus = exception
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const timestamp = new Date().toISOString();

    this.logger.error(`
    Status: ${httpStatus}
    Message: ${message}
    Error: ${error}
    Timestamp: ${timestamp}
    Path: ${request.url}
    Stack: ${stack}
    `);

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      error: error,
      timestamp: timestamp,
      path: httpAdapter.getRequestUrl(request),
    } as ErrorResponseType;

    response.status(httpStatus).json(responseBody);
  }
}
