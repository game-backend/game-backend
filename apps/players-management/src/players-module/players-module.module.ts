import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayersRepositoryModule } from '../players-repository/players-repository.module';

@Module({
  imports: [PlayersRepositoryModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModuleModule {}
