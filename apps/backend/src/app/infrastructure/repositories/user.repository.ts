import { Injectable } from "@nestjs/common";
import { UserDocument } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUserRepository } from "src/app/core/auth/interfaces/user.repository.interface";
import { User } from "src/app/core/auth/models/user";

@Injectable()
export class UserRepository implements IUserRepository {

    constructor(
        @InjectModel("Users") private userModel: Model<UserDocument>
    ) {}

    public async delete(username: string): Promise<void> {
        await this.userModel.deleteOne({username: username}).exec();
    }

    public async store(user: User): Promise<void> {
        return this.upsert(user);
    }

    public async get(): Promise<User[]>;
    public async get(name: string): Promise<User>;
    public async get(name?: unknown): Promise<User[] | User> {
        if (typeof name === 'string') {
            return await this.userModel.findOne({username: name}).exec();
        } else {
            const user = await this.userModel.find().exec();
            return user.map(userDbo => userDbo);
        }
    }

    public async exists(user: User): Promise<boolean> {
        return await this.userModel.exists({name: user.username}) !== null;
    }

    private async upsert(user: User): Promise<void> {
        let userDbo = await this.userModel.findOne({username: user.username}).exec();
        
        if(userDbo) {        
            userDbo.username = user.username;
            userDbo.password = user.password;
            userDbo.role = user.role;
            await userDbo.save();            
        } else {
            userDbo = new this.userModel(user);
            await userDbo.save();
        }
    }

}