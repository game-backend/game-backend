import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './schemas/player.schema';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';

@Injectable()
export class PlayersRepositoryService {
  constructor(@InjectModel(Player.name) private readonly playerModel: Model<Player>) {}

  findPlayerById(id: string): Promise<Player> {
    return this.playerModel.findById(id);
  }
  getPlayersByIds(ids: string[]) {
    return this.playerModel.find({
      _id: { $in: ids },
    });
  }
  createPlayer(createPlayerDto: CreatePlayerDto) {
    return this.playerModel.create(createPlayerDto);
  }
  updatePlayerById(id: string, updatePlayerDto: UpdatePlayerDto) {
    return this.playerModel.findByIdAndUpdate(id, { $set: updatePlayerDto }, { new: true });
  }
  deletePlayerById(id: string) {
    return this.playerModel.findByIdAndDelete(id);
  }
  async deleteAllPlayers(){
    await this.playerModel.deleteMany({})
  }
}
