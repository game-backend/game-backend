import { Injectable } from '@nestjs/common';
import { ApiService } from '@app/api-service/api.service';

@Injectable()
export class GameScoresApiService {
  private readonly path: string;

  constructor(private apiService: ApiService) {
    this.path = `${process.env.GAME_SCORES_SERVICE_HOST}/api/game-scores`;
  }

  async getTotalScoresByPlayer() {
    const url = `${this.path}/scores/total-by-player`;
    const axiosResponse = await this.apiService.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
      },
    });
    return axiosResponse.data;
  }
}
