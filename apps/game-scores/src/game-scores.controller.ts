import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { GameScoresService } from './game-scores.service';
import { ScoreDto } from './dto/score.dto';
import { InternalOnlyGuard } from '@app/shared/guards/internal.guard';
import { ApiBody, ApiCreatedResponse, ApiExcludeEndpoint, ApiOkResponse } from '@nestjs/swagger';

@Controller('scores')
export class GameScoresController {
  constructor(private readonly gameScoresService: GameScoresService) {}

  @ApiCreatedResponse({ description: 'Player Score has been successfully created.' })
  @ApiBody({ type: ScoreDto })
  @Post()
  saveScore(@Body() scoreDto: ScoreDto) {
    return this.gameScoresService.saveScore(scoreDto);
  }
  @ApiOkResponse({ description: 'GET top scores' })
  @Get('top')
  getTopScores() {
    return this.gameScoresService.getTopScores();
  }
  @ApiExcludeEndpoint()
  @UseGuards(InternalOnlyGuard)
  @Get('total-by-player')
  getTotalScoresByPlayer() {
    return this.gameScoresService.getTotalScoresByPlayer();
  }
  @ApiExcludeEndpoint()
  @UseGuards(InternalOnlyGuard)
  @Delete()
  async deleteAllScores(){
    await this.gameScoresService.deleteAllScores();
  }
}
