import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/core/auth/models/user';

export type UserDocument = HydratedDocument<UserDbo>;

@Schema()
export class UserDbo implements User {
    @Prop({required: true, unique: true})
    username: string; 

    @Prop({required: true})
    password: string;

    @Prop({required: true})
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDbo);