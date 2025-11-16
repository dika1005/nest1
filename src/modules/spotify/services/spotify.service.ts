import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

type TokenRecord = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
};

// Tambahkan tipe untuk response dari Spotify
interface SpotifyTokenResponse {
  access_token: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
  refresh_token?: string;
}

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);
  // In-memory token store for learning/demo (key = state / user id)
  private tokens = new Map<string, TokenRecord>();

  private clientId = process.env.SPOTIFY_CLIENT_ID || '';
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  private redirectUri =
    process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';

  getAuthUrl(state = 'default') {
    const scope = [
      'user-modify-playback-state',
      'user-read-playback-state',
      'user-read-currently-playing',
    ].join(' ');
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope,
      redirect_uri: this.redirectUri,
      state,
    });
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string, state = 'default') {
    const url = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
    }).toString();

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );

    // gunakan generic typing agar res.data bukan any
    const res = await axios.post<SpotifyTokenResponse>(url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
    });

    const data = res.data;
    const expires_at = Date.now() + (data.expires_in ?? 3600) * 1000;
    const record: TokenRecord = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at,
    };
    this.tokens.set(state, record);
    this.logger.log(`Stored Spotify tokens for state=${state}`);
    return record;
  }

  private async refreshIfNeededFor(state: string) {
    const t = this.tokens.get(state);
    if (!t) throw new Error(`No tokens stored for state=${state}`);
    // If token is still valid (with 20s buffer), return it
    if (t.expires_at && Date.now() < t.expires_at - 20000)
      return t.access_token;

    // refresh token
    const url = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: t.refresh_token || '',
    }).toString();
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );

    const res = await axios.post<SpotifyTokenResponse>(url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
    });

    const data = res.data;
    t.access_token = data.access_token;
    t.expires_at = Date.now() + (data.expires_in ?? 3600) * 1000;
    if (data.refresh_token) t.refresh_token = data.refresh_token;
    this.tokens.set(state, t);
    this.logger.log(`Refreshed Spotify access token for state=${state}`);
    return t.access_token;
  }

  async play(state: string, uris: string[], deviceId?: string) {
    const token = await this.refreshIfNeededFor(state);
    const url = 'https://api.spotify.com/v1/me/player/play';
    const params: Record<string, string> = {};
    if (deviceId) params.device_id = deviceId;

    await axios.put(
      url,
      { uris },
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return { ok: true };
  }
}
