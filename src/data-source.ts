import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Spotify_User } from './users/models/user';
import { TrackStat } from './stats/models/track-stat';
import { RecentlyPlayed } from './recently-played/models/recently-played';

config({ path: '.env' });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Spotify_User, TrackStat, RecentlyPlayed],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: true,
});
