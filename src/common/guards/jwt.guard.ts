import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

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
