import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreSchema, Score } from './schemas/score.schema';
import { ScoresRepositoryService } from './scores.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.SCORES_REPO_HOST),
    MongooseModule.forFeature([
      {
        name: Score.name,
        schema: ScoreSchema,
      },
    ]),
  ],
  providers: [ScoresRepositoryService],
  exports: [ScoresRepositoryService],
})
export class ScoresRepositoryModule {}
