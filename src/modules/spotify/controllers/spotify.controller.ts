import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { SpotifyService } from '../services/spotify.service';
import { PlayDto } from '../dto/play.dto';
import { Public } from 'src/common';

@Public()
@Controller()
export class SpotifyController {
  constructor(private readonly spotify: SpotifyService) {}

  // Redirect user to Spotify auth page. Use ?state=someId
  @Get('spotify/login')
  login(@Query('state') state = 'default', @Res() res: Response) {
    const url = this.spotify.getAuthUrl(state);
    return res.redirect(url);
  }

  // Callback must match redirect URI registered in Spotify (http://localhost:3000/callback)
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state = 'default',
  ) {
    if (!code) {
      throw new HttpException(
        'Missing code query param',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.spotify.exchangeCode(code, state);
    // simple JSON response; you can redirect to UI instead
    return { ok: true, state };
  }

  // Play endpoint. Body: { state, uris: ['spotify:track:...'], deviceId? }
  @Post('spotify/play')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async play(@Body() body: PlayDto) {
    await this.spotify.play(body.state, body.uris, body.deviceId);
    return { ok: true };
  }
}
