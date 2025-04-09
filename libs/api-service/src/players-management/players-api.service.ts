import { Injectable } from '@nestjs/common';
import { ApiService } from '@app/api-service/api.service';

@Injectable()
export class PlayersManagementApiService {
  private readonly path: string;

  constructor(private apiService: ApiService) {
    this.path = `${process.env.PLAYERS_MANAGEMENT_SERVICE_HOST}/api/players-management`;
  }

  async getPlayerById(id: string) {
    const url = `${this.path}/players/${id}`;
    const axiosResponse = await this.apiService.get(url);
    return axiosResponse.data;
  }
  async getPlayersByIds(ids: string[]) {
    const queries = ids.map((id) => `ids[]=${id}`).join('&');
    const url = `${this.path}/players?${queries}`;
    const axiosResponse = await this.apiService.get(url);
    return axiosResponse.data;
  }
}
