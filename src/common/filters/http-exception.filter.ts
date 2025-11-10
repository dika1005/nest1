import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return res.status(status).json({
        status: 'error',
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
        message: response,
      });
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      status: 'error',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Internal server error',
    });
  }
}
