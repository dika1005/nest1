import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { AppLogger } from 'src/common/services/logger.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(private readonly logger: AppLogger) {}

  @Public()
  @Get('public')
  checkPublic(): Record<string, boolean> {
    this.logger.log('health public checked');
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('private')
  checkPrivate(): Record<string, boolean> {
    this.logger.log('health private checked');
    return { ok: true, private: true };
  }
}
