import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as qs from 'qs';
import { SpotifyTokenResponse, SpotifyUserProfile } from 'src/types/spotify';
import { Spotify_User } from 'src/users/models/user';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    public readonly jwtService: JwtService,
  ) {}

  private clientId = process.env.SPOTIFY_CLIENT_ID;
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  private redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  getSpotifyAuthUrl() {
    const scopes = [
      'user-top-read',
      'user-read-email',
      'user-read-recently-played',
      'user-read-private',
    ].join(' ');

    const params = qs.stringify({
      response_type: 'code',
      client_id: this.clientId,
      scope: scopes,
      redirect_uri: this.redirectUri,
    });

    return `https://accounts.spotify.com/authorize?${params}`;
  }

  createJwtToken(payload: Spotify_User) {
    return this.jwtService.sign({
      sub: payload.id,
      expiresIn: '1h',
      email: payload.email,
      spotifyId: payload.spotifyId,
    });
  }

  async exchangeCodeForToken(code: string) {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
              'base64',
            ),
        },
      },
    );

    return response.data as SpotifyTokenResponse;
  }

  async saveUserTokens(tokens: SpotifyTokenResponse) {
    const profile = await axios.get<SpotifyUserProfile>(
      'https://api.spotify.com/v1/me',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );

    return this.userService.upsertSpotifyUser({
      spotifyId: profile.data.id,
      displayName: profile.data.display_name,
      email: profile.data.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
    });
  }
}
