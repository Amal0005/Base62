import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../database/abstractSchema';

@Schema({ 
  versionKey: false,
  timestamps:true

 })
export class User extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiry?: Date;

  @Prop({ default: false })
  isVerified?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);