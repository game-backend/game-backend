import { PlayersManagementApiService, GameScoresApiService } from '@app/api-service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class LeaderboardService implements OnModuleInit {
  private kafka;
  private kafkaConsumer: Consumer;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly playersManagementApiService: PlayersManagementApiService,
    private readonly gameScoresApiService: GameScoresApiService,
  ) { }

  async onModuleInit() {
    console.log('[LeaderboardService] - onModuleInit start');
    this.kafka = new Kafka({
      clientId: 'leaderboard-service',
      brokers: [process.env.KAFKA_HOST],
      retry: {
        retries: Number(process.env.KAFKA_RETRIES),
        initialRetryTime: Number(process.env.KAFKA_INITIAL_RETRY_TIME),
        multiplier: Number(process.env.KAFKA_RETRY_MULTIPLIER),
        maxRetryTime: Number(process.env.KAFKA_MAX_RETRY_TIME),
      },
    });

    const admin = this.kafka.admin();
    await admin.connect();

    const topics = await admin.listTopics();

    if (!topics.includes(process.env.TOPIC_SCORE_SUBMITTED)) {
      await admin.createTopics({
        topics: [
          {
            topic: process.env.TOPIC_SCORE_SUBMITTED,
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
    }

    await admin.disconnect();

    this.kafkaConsumer = this.kafka.consumer({
      groupId: process.env.LEADERBOARD_SERVICE_KAFKA_GROUP_ID,
    });
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({ topic: process.env.TOPIC_SCORE_SUBMITTED, fromBeginning: false });
    await this.kafkaConsumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        await this.handleIncomingMessage({ topic, partition, message });
      },
    });

    await this.rebuildLeaderboard();
    console.log('[LeaderboardService] - onModuleInit end');
  }

  async incrementScore(playerId: string, score: number): Promise<void> {
    await this.redis.zincrby(process.env.REDIS_KEY_LEADERBOARD, score, playerId);
  }

  async getTopPlayers(offset: number, limit: number): Promise<{ playerId: string; score: number }[]> {
    const raw = await this.redis.zrevrange(process.env.REDIS_KEY_LEADERBOARD, offset, offset + limit - 1, 'WITHSCORES');
    const result = [];

    for (let i = 0; i < raw.length; i += 2) {
      result.push({ playerId: raw[i], score: parseInt(raw[i + 1]) });
    }

    return result;
  }
  async getLeaderboard(page: number, reqLimit: number) {
    const limit = reqLimit > 100 ? 100 : reqLimit;
    const offset = (page - 1) * limit;

    const top = await this.getTopPlayers(offset, limit + 1);
    if (top.length === 0) {
      return {
        currentPage: 1,
        limit,
        hasNextPage: false,
        data: [],
      };
    }
    const hasNextPage = top.length > limit;
    const trimmed = hasNextPage ? top.slice(0, limit) : top;

    const playerIds = trimmed.map((t) => t.playerId);
    const players = await this.playersManagementApiService.getPlayersByIds(playerIds);

    const data = trimmed.map((entry) => {
      const player = players.find((p) => p._id === entry.playerId);
      return {
        playerId: entry.playerId,
        username: player?.username ?? 'Unknown',
        email: player?.email ?? '',
        score: entry.score,
      };
    });

    return {
      currentPage: page,
      limit,
      hasNextPage,
      data,
    };
  }
  async handleIncomingMessage({ topic, partition, message }) {
    const { data } = JSON.parse(message.value.toString());
    try {
      await this.incrementScore(data.playerId, data.score);
    } catch (err) {
      console.error('Failed to handle message, skipping commit:', err);
      return;
    }

    await this.kafkaConsumer.commitOffsets([
      {
        topic,
        partition,
        offset: (Number(message.offset) + 1).toString(),
      },
    ]);
  }
  async rebuildLeaderboard() {
    const redisKey = process.env.REDIS_KEY_LEADERBOARD;

    const zsetSize = await this.redis.zcard(redisKey);
    if (zsetSize > 0) {
      console.log('Redis leaderboard already populated, skipping rebuild.');
      return;
    }

    const lockKey = 'leaderboard-rebuild-lock';
    const lockAcquired = await this.redis.set(lockKey, 'locked', 'EX', 60, 'NX');
    if (!lockAcquired) {
      console.log('Another instance is rebuilding the leaderboard, skipping.');
      return;
    }

    console.log('Starting leaderboard rebuild from MongoDB...');
    const startTime = Date.now();

    try {
      const aggregation = await this.gameScoresApiService.getTotalScoresByPlayer();
      const pipeline = this.redis.multi();
      for (const entry of aggregation) {
        pipeline.zadd(redisKey, entry.totalScore, entry._id.toString());
      }

      await pipeline.exec();
      console.log(`Rebuild complete. ${aggregation.length} entries added.`);
    } catch (err) {
      console.error('Failed to rebuild leaderboard:', err);
    } finally {
      const duration = Date.now() - startTime;
      console.log(`Rebuild duration: ${duration}ms`);
    }
  }
}
