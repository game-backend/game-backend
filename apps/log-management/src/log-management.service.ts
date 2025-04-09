import { Inject, Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { CreateLogsDto } from './dto/create-logs.dto';
import { TokenBucketRateLimiterService } from '@app/token-bucket-rate-limiter';
import { LogsRepositoryService } from './logs-repository/logs-repository.service';
import { Redis } from 'ioredis';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { PlayersManagementApiService } from '@app/api-service/players-management/players-api.service';

@Injectable()
export class LogManagementService implements OnModuleInit {
  private kafka;
  private kafkaProducer: Producer;
  private kafkaConsumer: Consumer;
  constructor(
    private readonly playersManagementApiService: PlayersManagementApiService,
    private readonly logsRepository: LogsRepositoryService,
    private readonly tokenBucketRateLimiterService: TokenBucketRateLimiterService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) { }
  async onModuleInit() {
    console.log('[LogManagementService] - onModuleInit start');
    this.tokenBucketRateLimiterService.init(
      Number(process.env.LOGSMANAGEMENT_TOKENS_PER_SECOND),
      Number(process.env.LOGSMANAGEMENT_MAX_TOKENS),
      async (createLogDto) => this.logsRepository.addLogEntry(createLogDto),
      this.redisClient,
      'logs:queue'
    );
    this.tokenBucketRateLimiterService.start();
    this.kafka = new Kafka({
      clientId: 'logs-api',
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

    if (!topics.includes(process.env.TOPIC_LOGS_RAW)) {
      await admin.createTopics({
        topics: [
          {
            topic: process.env.TOPIC_LOGS_RAW,
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
    }

    await admin.disconnect();

    this.kafkaProducer = this.kafka.producer();
    await this.kafkaProducer.connect();

    this.kafkaConsumer = this.kafka.consumer({
      groupId: process.env.LOGSMANAGEMENT_SERVICE_KAFKA_GROUP_ID,
    });
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({ topic: process.env.TOPIC_LOGS_RAW, fromBeginning: false });
    await this.kafkaConsumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        await this.handleIncomingMessage({ topic, partition, message });
      },
    });
    console.log('[LogManagementService] - onModuleInit end');
  }
  async deleteAllLogs(){
    await this.logsRepository.deleteAllLogs()
  }
  async validatePlayerExists(playerId: string) {
    try {
      await this.playersManagementApiService.getPlayerById(playerId);
      return true;
    } catch (err) {
      console.log(`Player with id ${playerId} not found , skipping processing associated log entry.`);
      return false
    }
  }
  async createLogs(createLogsDto: CreateLogsDto) {
    await this.kafkaProducer.send({
      topic: process.env.TOPIC_LOGS_RAW,
      messages: [
        {
          key: createLogsDto.playerId,
          value: JSON.stringify(createLogsDto),
        },
      ],
    });
    return { message: `Log entry for playerId ${createLogsDto.playerId} accepted for proccessing` };
  }

  async handleLogMessage(createLogDto: CreateLogsDto) {
    try {
      if (!this.validatePlayerExists(createLogDto.playerId)) {
        return
      }
      if (this.tokenBucketRateLimiterService.tryTakeToken()) {
        await this.logsRepository.addLogEntry(createLogDto);
      } else {
        console.log('reached maximum token, enqueueing for later dispatch');
        await this.tokenBucketRateLimiterService.enqueue(createLogDto);
      }
    } catch (err) {
      console.error('Failed to process log entry, enqueuing for retry', err);
      await this.tokenBucketRateLimiterService.enqueue(createLogDto);
    }
  }
  async handleIncomingMessage({ topic, partition, message }) {
    const payload = JSON.parse(message.value.toString());

    try {
      await this.handleLogMessage(payload);
    } catch (err) {
      console.error('Failed to handle log message, skipping commit:', err);
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
  async getLogsByPlayerId(playerId: string) {
    if (await this.validatePlayerExists(playerId)) {
      const results = await this.logsRepository.getLogsByPlayerId(playerId);
      return results;
    }
    throw new NotFoundException(`Player with id ${playerId} not found.`);
  }
}
