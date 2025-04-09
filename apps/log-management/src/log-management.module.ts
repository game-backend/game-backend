import { Module } from '@nestjs/common';
import { LogManagementController } from './log-management.controller';
import { LogManagementService } from './log-management.service';
import { LogsRepositoryModule } from './logs-repository/logs-repository.module';
import { TokenBucketRateLimiterModule } from '@app/token-bucket-rate-limiter';
import Redis from 'ioredis';
import { ApiServiceModule } from '@app/api-service';

@Module({
  imports: [TokenBucketRateLimiterModule, LogsRepositoryModule, ApiServiceModule],
  controllers: [LogManagementController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
    LogManagementService,
  ],
})
export class LogManagementModule {}
