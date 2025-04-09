import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Score {
  @Prop({ type: String, required: true })
  playerId: string;

  @Prop({ type: Number, required: true })
  score: number;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
