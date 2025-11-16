export interface TokenEntity {
  access_token: string;
  refresh_token?: string;
  expires_at?: number; // unix ms timestamp
  scope?: string;
  token_type?: string;
}
