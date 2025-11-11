import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers['authorization'];

    if (!auth || typeof auth !== 'string') {
      this.logger.warn('Missing Authorization header');
      throw new UnauthorizedException('Authentication token missing');
    }

    const [scheme, token] = auth.split(' ');
    if (scheme !== 'Bearer' || token !== 'stub-token') {
      this.logger.warn('Invalid authentication token');
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
