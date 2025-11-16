import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { SpotifyModule } from './modules/spotify/spotify.module';

@Module({
  imports: [CommonModule, HealthModule, UsersModule, SpotifyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
