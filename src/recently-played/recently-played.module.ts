import { Module } from '@nestjs/common';
import { RecentlyPlayedService } from './recently-played.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecentlyPlayed } from './models/recently-played';

@Module({
  imports: [TypeOrmModule.forFeature([RecentlyPlayed])],
  exports: [RecentlyPlayedService],
  providers: [RecentlyPlayedService],
})
export class RecentlyPlayedModule {}
