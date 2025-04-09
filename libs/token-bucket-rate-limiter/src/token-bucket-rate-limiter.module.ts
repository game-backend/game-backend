import { Module } from '@nestjs/common';
import { TokenBucketRateLimiterService } from './token-bucket-rate-limiter.service';

@Module({
  providers: [TokenBucketRateLimiterService],
  exports: [TokenBucketRateLimiterService],
})
export class TokenBucketRateLimiterModule {}
