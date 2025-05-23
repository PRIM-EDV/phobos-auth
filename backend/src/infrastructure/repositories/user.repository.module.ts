import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { UserDbo, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Users", schema: UserSchema }])
    ],
    providers: [{
        provide: "UserRepository",
        useClass: UserRepository
    }],
    exports: [{
        provide: "UserRepository",
        useClass: UserRepository
    }]
})
export class UserRepositoryModule { }