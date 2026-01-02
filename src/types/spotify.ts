export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type SpotifyUserProfile = {
  id: string;
  display_name: string;
  email: string;
  href: string;
  images: { url: string }[];
};
