import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './library/logger/logger.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get Hello',
    description: 'Testing default route and get response from json placeholder',
  })
  @ApiResponse({
    status: 200,
    description: 'jsonplaceholder retrieved successfully',
  })
  getHello() {
    return this.appService.getHello();
  }
}
