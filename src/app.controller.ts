import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info('Calling getHello()', AppController.name);
    this.logger.debug('Calling getHello()', AppController.name);
    this.logger.verbose('Calling getHello()', AppController.name);
    this.logger.warn('Calling getHello()', AppController.name);
    return this.appService.getHello();
  }
}
