import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { RecentlyPlayedModule } from 'src/recently-played/recently-played.module';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [RecentlyPlayedModule, SpotifyModule, UsersModule, AuthModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
