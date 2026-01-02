import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ClientTimeRange } from 'src/types/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('track-stats/creator')
  async getCreatorTrackStats(@Query('timeRange') timeRange: ClientTimeRange) {
    return await this.statsService.getCreatorTracksForTimeRange(timeRange);
  }

  @UseGuards(JwtAuthGuard)
  @Get('track-stats/:userId')
  async getTrackStats(
    @Query('timeRange') timeRange: ClientTimeRange,
    @Param('userId') userId: string,
  ) {
    return await this.statsService.getTracksForTimeRange(userId, timeRange);
  }
}
