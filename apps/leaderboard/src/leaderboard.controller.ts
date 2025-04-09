import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiExcludeEndpoint, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { InternalOnlyGuard } from '@app/shared/guards/internal.guard';

@Controller('players')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @ApiOkResponse({ description: 'GET leaderboard.' })
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  @Get('top')
  async getLeaderboard(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.leaderboardService.getLeaderboard(page, limit);
  }

  @ApiExcludeEndpoint()
  @UseGuards(InternalOnlyGuard)
  @Post('rebuild-leaderboard')
  async rebuildLeaderboard(){
    await this.leaderboardService.rebuildLeaderboard();
  }
}
