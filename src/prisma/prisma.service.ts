import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-redundant-type-constituents,
   @typescript-eslint/no-unsafe-assignment,
   @typescript-eslint/no-unsafe-call,
   @typescript-eslint/no-unsafe-member-access,
   @typescript-eslint/no-unused-vars,
   @typescript-eslint/no-unsafe-return */
import type { PrismaClient as PrismaClientType } from '@prisma/client';

/**
 * Lazily initialize PrismaClient to avoid app crash when the generated client
 * isn't available at startup (common on Windows when symlinks fail or
 * developer hasn't run `prisma generate`).
 *
 * After successful initialization we copy the client's properties onto
 * this service instance so existing code that expects `prisma.user...`
 * continues to work.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClientType | undefined;
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    // Try to import the generated Prisma client at runtime. If it's not
    // available yet, log a helpful message and allow the app to continue
    // booting. DB functionality will throw clear errors later when used.
    let PrismaClientCtor: typeof import('@prisma/client').PrismaClient;
    try {
      const mod = await import('@prisma/client');
      PrismaClientCtor = mod.PrismaClient;
    } catch (err) {
      this.logger.warn('@prisma/client not ready — run `npx prisma generate`');
      return;
    }

    try {
      this.client = new PrismaClientCtor();
      // connect (may throw if DB unreachable)
      await this.client.$connect();
      // copy delegate methods (user, etc.) onto this service so callers can
      // keep using `this.prisma.user.findMany()` syntax. Cast to record to
      // satisfy TS when copying properties.
      // cast via `unknown` first so TypeScript accepts the conversion from PrismaClient
      // to a generic record (avoids TS2352).
      Object.assign(this, this.client as unknown as Record<string, unknown>);
      this.logger.log('Prisma client connected');
    } catch (err) {
      this.logger.error(
        'Prisma client failed to connect',
        String((err as Error)?.message ?? err),
      );
      // keep client undefined so later DB calls will fail with a helpful error
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect();
    }
  }

  /**
   * Helper to get the underlying client; throws if not initialized.
   */
  get raw(): PrismaClientType {
    if (!this.client) {
      throw new Error(
        'Prisma client not initialized. Run `npx prisma generate` and restart the app.',
      );
    }
    return this.client;
  }
}
