import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { MongoIdParam } from 'apps/shared/dto/mongo-id-param';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { PlayersService } from './players.service';
import { ApiBody, ApiCreatedResponse, ApiExcludeEndpoint, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { InternalOnlyGuard } from '@app/shared/guards/internal.guard';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @ApiCreatedResponse({ description: 'Player has been successfully created.' })
  @ApiBody({ type: CreatePlayerDto })
  @Post()
  createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.createPlayer(createPlayerDto);
  }
  @ApiOkResponse({ description: 'GET Players' })
  @Get()
  getPlayersByIds(@Query('ids') ids: string[]) {
    return this.playersService.getPlayersByIds(ids);
  }
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'GET Players by ids' })
  @Get(':id')
  getPlayerById(@Param() mongoIdParam: MongoIdParam) {
    return this.playersService.getPlayerById(mongoIdParam.id);
  }
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'PUT Player by Id' })
  @ApiBody({ type: UpdatePlayerDto })
  @Put(':id')
  updatePlayerById(@Param() mongoIdParam: MongoIdParam, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.updatePlayerById(mongoIdParam.id, updatePlayerDto);
  }
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'DELETE Player by Id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePlayerById(@Param() mongoIdParam: MongoIdParam) {
    return this.playersService.deletePlayerById(mongoIdParam.id);
  }

  @ApiExcludeEndpoint()
  @UseGuards(InternalOnlyGuard)
  @Delete()
  async deleteAllPlayers(){
    await this.playersService.deleteAllPlayers();
  }
}
