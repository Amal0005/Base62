import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '../../database/abstractSchema';

@Schema({ versionKey: false })
export class Url extends AbstractDocument {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortId: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
