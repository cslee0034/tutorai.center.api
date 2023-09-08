import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const className = context.getClass().name;
    const handler = context.getHandler();
    const methodName = handler.name;

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `----- ${className}.${methodName}() took ${
              Date.now() - startTime
            }ms -----`,
          ),
        ),
      );
  }
}
