import { TokenBucket } from './token-bucket';
import { RedisQueueService } from './redis-queue.service';

export class TokenBucketScheduler<T> {
  private intervalId;

  constructor(
    private readonly bucket: TokenBucket,
    private readonly queue: RedisQueueService<T>,
    private readonly processFn: (item: T) => Promise<void>,
    private readonly checkIntervalMs: number = 250,
  ) {}

  start() {
    this.intervalId = setInterval(async () => {
      try {
        while (true) {
          const item = await this.queue.dequeue();
          if (!item) break;
          if (!this.bucket.tryTakeToken()) {
            await this.queue.requeue(item);
            break;
          }

          try {
            await this.processFn(item);
          } catch (err) {
            console.error('Error processing item, requeuing...', err);
            await this.queue.requeue(item);
            break;
          }
        }
      } catch (err) {
        console.error('Scheduler failure', err);
      }
    }, this.checkIntervalMs);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}
