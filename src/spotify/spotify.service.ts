import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  SpotifyRecentlyPlayedResponse,
  SpotifyTopTracksResponse,
} from 'src/types/common';
import { Spotify_User } from 'src/users/models/user';
import { RecentlyPlayedDto } from './dtos/recently-played-dto';

@Injectable()
export class SpotifyService {
  async getTopTracks(
    user: Spotify_User,
    timeRange: 'short_term' | 'medium_term' | 'long_term',
  ): Promise<SpotifyTopTracksResponse> {
    const res = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${user.spotifyAccessToken}` },
      params: { time_range: timeRange, limit: 10 },
    });

    return res.data as unknown as SpotifyTopTracksResponse;
  }

  async getRecentlyPlayed(
    user: Spotify_User,
    limit = 50,
    since: Date,
    url?: string,
  ): Promise<{ items: RecentlyPlayedDto[]; next: string | undefined }> {
    const res = await axios.get<SpotifyRecentlyPlayedResponse>(
      url || 'https://api.spotify.com/v1/me/player/recently-played',
      {
        headers: { Authorization: `Bearer ${user.spotifyAccessToken}` },
        params: { limit, after: since },
      },
    );

    return {
      items: res.data.items.map((item) => ({
        trackId: item.track.id,
        trackName: item.track.name,
        artistName: item.track.artists[0].name,
        playedAt: new Date(item.played_at),
      })),
      next: res.data.next || undefined,
    };
  }
}
