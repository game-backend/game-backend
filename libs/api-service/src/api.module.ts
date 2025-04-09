import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { PlayersManagementApiService } from './players-management/players-api.service';
import { HttpModule } from '@nestjs/axios';
import { GameScoresApiService } from './game-scores/game-scores-api.service';

@Module({
  imports: [HttpModule],
  providers: [ApiService, PlayersManagementApiService, GameScoresApiService],
  exports: [ApiService, PlayersManagementApiService, GameScoresApiService],
})
export class ApiServiceModule {}
