import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(body): string {
    throw new Error('error');
    return body.hello;
    return 'Hello World!';
  }
}
