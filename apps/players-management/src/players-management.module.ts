import { Module, MiddlewareConsumer } from '@nestjs/common';
import { PlayersManagementService } from './players-management.service';
import { PlayersRepositoryModule } from './players-repository/players-repository.module';
import { ConfigModule } from '@nestjs/config';
import { PlayersModuleModule } from './players-module/players-module.module';

@Module({
  imports: [ConfigModule.forRoot(), PlayersRepositoryModule, PlayersModuleModule],
  controllers: [],
  providers: [PlayersManagementService],
})
export class PlayersManagementModule {}
