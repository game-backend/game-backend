import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MongoErrorCodeEnum } from 'apps/shared/errors/mongo/mongo-error-code.enum';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { PlayersRepositoryService } from '../players-repository/players-repository.service';

@Injectable()
export class PlayersService {
  constructor(private readonly playerRepositoryService: PlayersRepositoryService) {}
  async getPlayerById(id: string) {
    const player = await this.playerRepositoryService.findPlayerById(id);
    if (!player) throw new NotFoundException(`Player with id ${id} not found.`);
    return player;
  }
  getPlayersByIds(ids: string[]) {
    console.log(ids);
    return this.playerRepositoryService.getPlayersByIds(ids);
  }
  async createPlayer(createPlayerDto: CreatePlayerDto) {
    try {
      return await this.playerRepositoryService.createPlayer(createPlayerDto);
    } catch (err) {
      const isDuplicateKeyError = err.code === MongoErrorCodeEnum.DUPLICATE_KEY;
      if (isDuplicateKeyError) {
        const duplicateKeys = Object.keys(err.keyPattern);
        throw new ConflictException(`A player with the provided ${duplicateKeys} already exists`);
      }
      throw err;
    }
  }
  async updatePlayerById(id: string, updatePlayerDto: UpdatePlayerDto) {
    const updatedPlayer = await this.playerRepositoryService.updatePlayerById(id, updatePlayerDto);
    if (!updatedPlayer) throw new NotFoundException(`Player with id ${id} not found.`);
    return updatedPlayer;
  }
  async deletePlayerById(id: string) {
    const deletedPlayer = await this.playerRepositoryService.deletePlayerById(id);
    if (!deletedPlayer) throw new NotFoundException(`Player with id ${id} not found.`);
  }
  async deleteAllPlayers(){
    await this.playerRepositoryService.deleteAllPlayers();
  }
}
