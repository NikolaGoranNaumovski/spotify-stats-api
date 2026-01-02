/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, BadRequestException } from '@nestjs/common';
import { SpotifyService } from '../spotify/spotify.service';
import { RecentlyPlayedService } from '../recently-played/recently-played.service';
import { Spotify_User } from '../users/models/user';
import { ClientTimeRange } from 'src/types/common';
import { UsersService } from 'src/users/users.service';
import { GetMostPopularSongsDto } from './dtos/get-most-popular-songs.dto';
import { RecentlyPlayedDto } from 'src/spotify/dtos/recently-played-dto';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UsersService,
    private readonly spotifyService: SpotifyService,
    private readonly recentlyPlayedService: RecentlyPlayedService,
  ) {}

  private hoursAgo(hours: number) {
    return new Date(Date.now() - hours * 60 * 60 * 1000);
  }

  private daysAgo(days: number) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }

  async handleSpotifyFetch(
    user: Spotify_User,
    timeRange: 'short_term' | 'medium_term' | 'long_term',
  ): Promise<GetMostPopularSongsDto[]> {
    const response = await this.spotifyService.getTopTracks(user, timeRange);

    return response.items.map((item) =>
      GetMostPopularSongsDto.toModelFromSpotify(item),
    );
  }

  async getLocalTrackStatsForUser(
    user: Spotify_User,
    since: Date,
  ): Promise<GetMostPopularSongsDto[]> {
    const recentlyPlayedTracks: RecentlyPlayedDto[] = [];

    let shouldRefetch = true;
    let nextSongs: string | undefined = undefined;

    while (shouldRefetch) {
      const { items, next } = await this.spotifyService.getRecentlyPlayed(
        user,
        50,
        since,
        nextSongs,
      );

      if (
        (items.length === 50 && items[49].playedAt < since) ||
        items.length < 50
      ) {
        shouldRefetch = false;
      } else {
        nextSongs = next;
      }

      recentlyPlayedTracks.push(...items);
    }

    const trackCountMap = new Map<
      string,
      { count: number; track: RecentlyPlayedDto }
    >();

    for (const track of recentlyPlayedTracks) {
      if (trackCountMap.has(track.trackId)) {
        trackCountMap.get(track.trackId)!.count += 1;
      } else {
        trackCountMap.set(track.trackId, { count: 1, track });
      }
    }

    const sortedUniqueTracks = Array.from(trackCountMap.values())
      .sort((a, b) => b.count - a.count)
      .map((entry) => entry.track);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.recentlyPlayedService.saveRecentlyPlayed(user, recentlyPlayedTracks);

    return sortedUniqueTracks
      .slice(0, 10)
      .map((item) =>
        GetMostPopularSongsDto.toModelFromRecentlyPlayedOnSpotify(item),
      );
  }

  async getTracksForTimeRange(
    userId: string,
    timeRange: ClientTimeRange,
  ): Promise<GetMostPopularSongsDto[]> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    switch (timeRange) {
      case '1month':
        return this.handleSpotifyFetch(user, 'short_term');

      case '6month':
        return this.handleSpotifyFetch(user, 'medium_term');

      case '12month':
        return this.handleSpotifyFetch(user, 'long_term');

      case '1hr':
        return this.getLocalTrackStatsForUser(user, this.hoursAgo(1));
      case '24hr':
        return this.getLocalTrackStatsForUser(user, this.hoursAgo(24));

      case '7day':
        return this.getLocalTrackStatsForUser(user, this.daysAgo(7));

      default:
        throw new BadRequestException('Invalid timeRange');
    }
  }

  async getCreatorTracksForTimeRange(
    timeRange: ClientTimeRange,
  ): Promise<GetMostPopularSongsDto[]> {
    const creatorUser = await this.userService.findCreatorUser();

    return this.getTracksForTimeRange(creatorUser.id, timeRange);
  }
}
