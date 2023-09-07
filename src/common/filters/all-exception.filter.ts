import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errorMessage = (exception as any)?.message || 'Internal server error';
    const stack = (exception as any)?.stack;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const date = new Date().toISOString();

    this.logger.error(`
    Date: ${date}
    Path: ${request.url}
    Status: ${status}
    Error: ${errorMessage}
    Stack: ${stack}
    `);

    response.status(status).json({
      status: status,
      message: errorMessage,
      path: request.url,
      date: date,
    });
  }
}
