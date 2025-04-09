import { Injectable } from '@nestjs/common';
import { TokenBucketScheduler } from './token-bucket-scheduler';
import { TokenBucket } from './token-bucket';
import { RedisQueueService } from './redis-queue.service';

@Injectable()
export class TokenBucketRateLimiterService {
  private bucket: TokenBucket;
  private queue;
  private tokenBucketScheduler;
  constructor() {}
  init(tokensPerSecond: number, maxTokens: number, task, redisClient, redisQueueKey: string) {
    this.bucket = new TokenBucket(tokensPerSecond, maxTokens);
    this.queue = new RedisQueueService(redisClient, redisQueueKey);
    this.tokenBucketScheduler = new TokenBucketScheduler(this.bucket, this.queue, task);
  }
  start() {
    this.tokenBucketScheduler.start();
  }
  tryTakeToken() {
    return this.bucket.tryTakeToken();
  }
  async enqueue(task) {
    await this.queue.enqueue(task);
  }
  numberOfTokensLeft() {
    return this.bucket.numberOfTokensLeft();
  }
}
