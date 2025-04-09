import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ScoresRepositoryService } from './scores-repository/scores.service';
import { ScoreDto } from './dto/score.dto';
import { PlayersManagementApiService } from '@app/api-service/players-management/players-api.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GameScoresService {
  constructor(
    private readonly scoresRepositoryService: ScoresRepositoryService,
    private readonly playersManagementApiService: PlayersManagementApiService,
    @Inject('SCORE_EVENT_BUS') private readonly client: ClientProxy,
  ) { }
  async saveScore(scoreDto: ScoreDto) {
    await this.validatePlayerExistsOrTrow(scoreDto.playerId);
    const createdScore = await this.scoresRepositoryService.createScore(scoreDto);
    await this.client.emit(process.env.TOPIC_SCORE_SUBMITTED, { data: scoreDto }).toPromise(); // TODO: update to the latest ClientProxy emit api
    return createdScore;
  }
  getTopScores() {
    return this.scoresRepositoryService.getTopScores();
  }
  async validatePlayerExistsOrTrow(playerId: string) {
    try {
      await this.playersManagementApiService.getPlayerById(playerId);
    } catch (err) {
      throw new NotFoundException(`Player with id ${playerId} not found.`);
    }
  }
  async getTotalScoresByPlayer() {
    return this.scoresRepositoryService.getTotalScoresByPlayer();
  }
  async deleteAllScores(){
    await this.scoresRepositoryService.deleteAllScores();
  }
}
