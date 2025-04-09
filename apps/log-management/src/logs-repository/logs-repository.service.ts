import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './schemas/log.schema';

@Injectable()
export class LogsRepositoryService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  addLogEntry(logEntry) {
    return this.logModel.create(logEntry);
  }
  getLogsByPlayerId(playerId:string){
    return this.logModel.find({playerId});
  }
  async deleteAllLogs(){
    await this.logModel.deleteMany({})
  }
}
