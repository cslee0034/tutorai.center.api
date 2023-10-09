import { Injectable } from '@nestjs/common';
import { HTTPService } from './infrastructure/http/http.service';
import { LoggerService } from './infrastructure/logger/logger.service';
import { lastValueFrom, map, tap } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HTTPService,
  ) {}

  public async getHello() {
    const todos$ = this.httpService
      .get<any>('https://jsonplaceholder.typicode.com/todos/1')
      .pipe(
        tap(() => this.logger.info('Hello')),
        map((axiosResponse: AxiosResponse) => axiosResponse.data),
      );

    const lastValue = await lastValueFrom(todos$);

    this.logger.info(`Last value is ${JSON.stringify(lastValue)}`);
    this.logger.info(`User ID is ${lastValue.userId}`);

    return lastValue;
  }
}
