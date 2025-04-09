import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { ConfigModule } from '@nestjs/config';
import { ApiServiceModule } from '@app/api-service';
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule.forRoot(), ApiServiceModule],
  controllers: [LeaderboardController],
  providers: [
    LeaderboardService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
  ],
})
export class LeaderboardModule {}
