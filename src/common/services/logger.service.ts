import { Injectable, Logger, LogLevel } from '@nestjs/common';

@Injectable()
export class AppLogger {
  private logger = new Logger('App');

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }

  setContext(context: string) {
    // Recreate Logger instance with new context instead of mutating internal fields
    // (avoids unsafe member access and is compatible across Nest versions)
    this.logger = new Logger(context);
  }
  setLogLevels(levels: LogLevel[]) {
    Logger.overrideLogger(levels);
  }
}
