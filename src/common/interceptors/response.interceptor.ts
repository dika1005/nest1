import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_KEYS } from '../constants';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      map((data: unknown) => ({
        [RESPONSE_KEYS.STATUS]: 'success',
        [RESPONSE_KEYS.TIMESTAMP]: new Date().toISOString(),
        [RESPONSE_KEYS.DURATION]: `${Date.now() - start}ms`,
        [RESPONSE_KEYS.DATA]: data,
      })),
    );
  }
}
