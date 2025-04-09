import { CUSTOM_ERROR_MESSAGES } from '@app/shared/errors/error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, Min } from 'class-validator';

export class ScoreDto {
  @ApiProperty()
  @IsMongoId({
    message: CUSTOM_ERROR_MESSAGES.INVALID_MONGO_ID,
  })
  playerId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  score: number;
}
