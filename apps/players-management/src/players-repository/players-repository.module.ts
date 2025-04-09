import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersRepositoryService } from './players-repository.service';
import { Player, PlayerSchema } from './schemas/player.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.PLAYERS_REPO_HOST),
    MongooseModule.forFeature([
      {
        name: Player.name,
        schema: PlayerSchema,
      },
    ]),
  ],
  providers: [PlayersRepositoryService],
  exports: [PlayersRepositoryService],
})
export class PlayersRepositoryModule {}
