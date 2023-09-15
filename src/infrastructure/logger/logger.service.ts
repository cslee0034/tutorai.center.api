import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public debug(message: any) {
    this.logger.debug(message);
  }

  public info(message: any) {
    this.logger.info(message);
  }

  public warn(message: any) {
    this.logger.warn(message);
  }

  public error(message: any) {
    this.logger.error(message);
  }
}
