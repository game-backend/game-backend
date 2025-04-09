import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString, Length, Matches } from 'class-validator';
import { LogSeverityEnum } from '../enum/log-severity.enum';
import { CUSTOM_ERROR_MESSAGES } from '@app/shared/errors/error-messages';

export class CreateLogsDto {
  @ApiProperty()
  @IsMongoId({
    message: CUSTOM_ERROR_MESSAGES.INVALID_MONGO_ID,
  })
  playerId: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z0-9 ]+$/, {
    message: CUSTOM_ERROR_MESSAGES.INVALID_CHARACTERS_IN_LOG_DATA,
  })
  
  @Length(
    Number(process.env.LOG_DATA_MIN_CHARS), 
    Number(process.env.LOG_DATA_MAX_CHARS)
  )
  logData: string;

  @ApiProperty()
  @IsEnum(LogSeverityEnum)
  severity: LogSeverityEnum;
}
