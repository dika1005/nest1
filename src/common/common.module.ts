import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
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
    AppLogger, // daftarkan logger sebagai provider
    JwtAuthGuard, // daftarkan JwtAuthGuard sebagai provider
  ],
  exports: [AppLogger, JwtAuthGuard], // ekspor supaya bisa di-inject di module lain
})
export class CommonModule {}
