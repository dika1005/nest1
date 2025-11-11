import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppLogger } from './services/logger.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // guard jadi global
    },
    AppLogger,
  ],
  exports: [AppLogger],
})
export class CommonModule {}
