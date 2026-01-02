import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spotify_User } from './users/models/user';
import { TrackStat } from './stats/models/track-stat';
import { RecentlyPlayed } from './recently-played/models/recently-played';
import { UsersModule } from './users/users.module';
import { StatsModule } from './stats/stats.module';
import { SpotifyModule } from './spotify/spotify.module';
import { AuthModule } from './auth/auth.module';
import { RecentlyPlayedModule } from './recently-played/recently-played.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        ssl: {
          rejectUnauthorized:
            configService.get<string>('NODE_ENV') !== 'production',
        },
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Spotify_User, TrackStat, RecentlyPlayed],
        cli: {
          migrationsDir: 'src/migrations',
        },
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true,
      }),
    }),

    UsersModule,
    StatsModule,
    SpotifyModule,
    AuthModule,
    RecentlyPlayedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
