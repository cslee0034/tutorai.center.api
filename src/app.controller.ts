import { Body, Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TimingInterceptor } from './common/interceptor/timing.interceptor';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @UseInterceptors(TimingInterceptor)
  getHello(@Body() body: Body): string {
    this.logger.info('Calling getHello()');
    this.logger.debug('Calling getHello()');
    this.logger.warn('Calling getHello()');
    this.logger.error('Calling getHello()');
    return this.appService.getHello(body);
  }
}
