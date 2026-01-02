import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Spotify_User } from 'src/users/models/user';
import { RecentlyPlayed } from './models/recently-played';
import { Repository } from 'typeorm';
import { LocalTrackStat } from 'src/types/common';
import { RecentlyPlayedDto } from 'src/spotify/dtos/recently-played-dto';

@Injectable()
export class RecentlyPlayedService {
  constructor(
    @InjectRepository(RecentlyPlayed)
    private readonly repo: Repository<RecentlyPlayed>,
  ) {}

  public async getTopTracksSince(
    user: Spotify_User,
    since: Date,
  ): Promise<LocalTrackStat[]> {
    return this.repo
      .createQueryBuilder('rp')
      .select([
        'rp.trackId AS trackId',
        'rp.trackName AS trackName',
        'rp.artistName AS artistName',
        'COUNT(*)::int AS playCount',
      ])
      .where('rp.userId = :userId', { userId: user.id })
      .andWhere('rp.playedAt >= :since', { since })
      .groupBy('rp.trackId, rp.trackName, rp.artistName')
      .orderBy('playCount', 'DESC')
      .limit(10)
      .getRawMany<LocalTrackStat>();
  }

  public async saveRecentlyPlayed(
    user: Spotify_User,
    tracks: RecentlyPlayedDto[],
  ): Promise<RecentlyPlayed[]> {
    const entities = tracks.map((track) => {
      const instance = this.repo.create();

      instance.user = user;
      instance.trackId = track.trackId;
      instance.trackName = track.trackName;
      instance.artistName = track.artistName;
      instance.albumName = track.albumName || '';
      instance.playedAt = track.playedAt;
      instance.albumImageUrl = track.albumImageUrl || '';

      return instance;
    });

    return this.repo.save(entities);
  }
}
