import { RecentlyPlayedDto } from 'src/spotify/dtos/recently-played-dto';
import { LocalTrackStat, SpotifyTrack } from 'src/types/common';

export class GetMostPopularSongsDto {
  constructor(
    public name: string,
    public artist: string,
    public genre: string,
  ) {}
  public static toModelFromSpotify(
    track: SpotifyTrack,
  ): GetMostPopularSongsDto {
    return new GetMostPopularSongsDto(track.name, track.artists[0].name, '');
  }

  public static toModelFromLocal(track: LocalTrackStat) {
    return new GetMostPopularSongsDto(track.trackName, track.artistName, '');
  }

  public static toModelFromRecentlyPlayedOnSpotify(track: RecentlyPlayedDto) {
    return new GetMostPopularSongsDto(track.trackName, track.artistName, '');
  }
}
