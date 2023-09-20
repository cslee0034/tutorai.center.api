import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './infrastructure/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
