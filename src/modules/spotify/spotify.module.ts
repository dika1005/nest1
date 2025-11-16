import { Module } from '@nestjs/common';
import { SpotifyController } from './controllers/spotify.controller';
import { SpotifyService } from './services/spotify.service';

@Module({
  imports: [],
  controllers: [SpotifyController],
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
