import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Player {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  email: string;
}
export const PlayerSchema = SchemaFactory.createForClass(Player);
