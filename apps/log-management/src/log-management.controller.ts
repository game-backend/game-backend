import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LogManagementService } from './log-management.service';
import { CreateLogsDto } from './dto/create-logs.dto';
import { ApiBody, ApiCreatedResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { MongoIdParam } from '@app/shared/dto/mongo-id-param';
import { InternalOnlyGuard } from '@app/shared/guards/internal.guard';

@Controller()
export class LogManagementController {
  constructor(private readonly logManagementService: LogManagementService) {}

  @ApiBody({ type: CreateLogsDto })
  @ApiCreatedResponse({ description: 'Log Entry accepted for processing.' })
  @Post('logs')
  createLogs(@Body() createLogsDto: CreateLogsDto) {
    return this.logManagementService.createLogs(createLogsDto);
  }
  
  @ApiExcludeEndpoint()
  @UseGuards(InternalOnlyGuard)
  @Get('get-logs-by-player-id/:id')
  getLogsByPlayerId(@Param() mongoIdParam: MongoIdParam) {
    return this.logManagementService.getLogsByPlayerId(mongoIdParam.id);
  }
  @ApiExcludeEndpoint()
  @UseGuards(InternalOnlyGuard)
  @Delete()
  async deleteAllLogs(){
    await this.logManagementService.deleteAllLogs();
  }
}
