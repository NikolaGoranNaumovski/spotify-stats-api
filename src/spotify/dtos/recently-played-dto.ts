export interface RecentlyPlayedDto {
  trackId: string;
  trackName: string;
  artistName: string;
  albumName?: string;
  durationMs?: number;
  albumImageUrl?: string;
  playedAt: Date;
}
