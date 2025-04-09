import { Module } from '@nestjs/common';
import { GameScoresController } from './game-scores.controller';
import { GameScoresService } from './game-scores.service';
import { ScoresRepositoryModule } from './scores-repository/scores-repository.module';
import { ConfigModule } from '@nestjs/config';
import { ApiServiceModule } from '@app/api-service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'SCORE_EVENT_BUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'score-service',
            brokers: [process.env.KAFKA_HOST],
            retry: {
              retries: Number(process.env.KAFKA_RETRIES),
              initialRetryTime: Number(process.env.KAFKA_INITIAL_RETRY_TIME),
              multiplier: Number(process.env.KAFKA_RETRY_MULTIPLIER),
              maxRetryTime: Number(process.env.KAFKA_MAX_RETRY_TIME),
            },
          },
          producerOnlyMode: true,
        },
      },
    ]),
    ScoresRepositoryModule,
    ApiServiceModule,
  ],
  controllers: [GameScoresController],
  providers: [GameScoresService],
})
export class GameScoresModule {}
