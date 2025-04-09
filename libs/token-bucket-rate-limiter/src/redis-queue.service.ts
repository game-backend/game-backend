import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisQueueService<T> {
  constructor(
    private readonly redisClient: Redis,
    private readonly queueKey: string,
  ) {}

  async enqueue(item: T): Promise<void> {
    const serialized = JSON.stringify(item);
    await this.redisClient.rpush(this.queueKey, serialized);
  }

  async dequeue(): Promise<T | null> {
    const data = await this.redisClient.lpop(this.queueKey);
    return data ? (JSON.parse(data) as T) : null;
  }

  async requeue(item: T): Promise<void> {
    const serialized = JSON.stringify(item);
    await this.redisClient.rpush(this.queueKey, serialized);
  }

  async length(): Promise<number> {
    return this.redisClient.llen(this.queueKey);
  }

  async peekAll(limit = 10): Promise<T[]> {
    const items = await this.redisClient.lrange(this.queueKey, 0, limit - 1);
    return items.map((item) => JSON.parse(item) as T);
  }
}
