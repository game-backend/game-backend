import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LogSeverityEnum } from '../../enum/log-severity.enum';

@Schema({ timestamps: true, versionKey: false })
export class Log {
  @Prop({ type: String, required: true })
  playerId: string;

  @Prop({ type: String, required: true })
  logData: string;

  @Prop({ type: String, required: true })
  severity: LogSeverityEnum;
}
export const LogSchema = SchemaFactory.createForClass(Log);
