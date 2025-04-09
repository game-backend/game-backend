import { IsOptional, IsString, IsEmail, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CUSTOM_ERROR_MESSAGES } from '@app/shared/errors/error-messages';

export class UpdatePlayerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(4, 30)
  @Matches(/^[a-zA-Z0-9_!]+$/, {
    message: CUSTOM_ERROR_MESSAGES.INVALID_CHARACTERS_IN_USERNAME,
  })
  username?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;
}
