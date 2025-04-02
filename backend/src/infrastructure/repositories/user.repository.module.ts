import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { UserDbo, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserDbo.name, schema: UserSchema }])
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
export class USerRepositoryModule { }