import { Body, Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TimingInterceptor } from './common/interceptor/timing.interceptor';
import { LoggerService } from './infrastructure/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @UseInterceptors(TimingInterceptor)
  getHello(): string {
    return this.appService.getHello();
  }
}
