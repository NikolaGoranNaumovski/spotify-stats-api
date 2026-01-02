export type ClientTimeRange =
  | '1hr'
  | '24hr'
  | '7day'
  | '1month'
  | '6month'
  | '12month';

export interface LocalTrackStat {
  trackId: string;
  trackName: string;
  artistName: string;
  playCount: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbumImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyAlbum {
  name: string;
  images: SpotifyAlbumImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  duration_ms: number;
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: string | null;
  next: string | null;
}

// Represents a single artist object from Spotify
export interface SpotifyArtist {
  id: string;
  name: string;
  type: string;
  uri: string;
}

// Represents a Spotify album object
export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  images: { url: string; height: number; width: number }[];
  artists: SpotifyArtist[];
  external_urls: { spotify: string };
}

// Represents a Spotify track object
export interface SpotifyTrack {
  id: string;
  name: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  duration_ms: number;
  uri: string;
  is_local: boolean;
  preview_url: string | null;
  track_number: number;
  popularity: number;
  explicit: boolean;
  external_ids?: { [key: string]: string };
  external_urls: { spotify: string };
}

// Context of playback, like playlist or album
export interface SpotifyContext {
  type: string;
  href: string;
  external_urls: { spotify: string };
  uri: string;
  // optional fields depending on context type
}

// Represents a single "recently played" item
export interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string; // ISO string
  context: SpotifyContext | null;
}

// Full response from Spotify API
export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyRecentlyPlayedItem[];
  next: string | null;
  cursors: { after: string; before: string };
  limit: number;
  href: string;
}
