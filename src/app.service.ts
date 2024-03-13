import { Injectable } from '@nestjs/common';
import { LoggerService } from './library/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}

  public async getHello() {
    return 'hello';
  }
}
