import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Score } from './schemas/score.schema';
import { ScoreDto } from '../dto/score.dto';

@Injectable()
export class ScoresRepositoryService {
  constructor(@InjectModel(Score.name) private readonly scoreModel: Model<Score>) {}
  createScore(scoreDto: ScoreDto) {
    return this.scoreModel.create(scoreDto);
  }
  getTopScores() {
    // TODO: make the number of returned scores a param
    return this.scoreModel.find({}).sort({ score: -1 }).limit(10);
  }
  getTotalScoresByPlayer() {
    return this.scoreModel.aggregate([
      {
        $group: {
          _id: '$playerId',
          totalScore: { $sum: '$score' },
        },
      },
    ]);
  }

  async deleteAllScores(){
    await this.scoreModel.deleteMany({});
  }
}
