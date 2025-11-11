import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [CommonModule, HealthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
