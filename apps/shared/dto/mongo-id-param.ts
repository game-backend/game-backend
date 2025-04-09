import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CUSTOM_ERROR_MESSAGES } from '../errors/error-messages';

export class MongoIdParam {
  @IsMongoId({
    message: CUSTOM_ERROR_MESSAGES.INVALID_MONGO_ID,
  })
  @ApiProperty()
  id: string;
}
