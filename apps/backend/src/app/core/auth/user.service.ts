import { Inject, Injectable } from '@nestjs/common';

import { UserRepository } from 'src/app/infrastructure/repositories/user.repository';
import { User } from './models/user';

@Injectable()
export class UserService {
    constructor(
        @Inject("UserRepository") private userRepository: UserRepository
    ) {
        this.initRepository().then().catch(() => console.error);
    }

    public async getUser(username: string): Promise<User> {
        return this.userRepository.get(username);
    }

    public async getAllUsers(): Promise<User[]> {
        return this.userRepository.get();
    }

    public async setUser(user: User): Promise<any> {
        return this.userRepository.store(user);
    }

    public async deleteUser(username: string): Promise<any> {
        return this.userRepository.delete(username);
    }

    private async initRepository(): Promise<void> {
        if (await this.userRepository.get().then(users => users.length === 0)) {
            const adminUser: User = {
                username: "admin",
                password: "$argon2id$v=19$m=65536,t=3,p=4$rAcSfgprITJPT9XMav4NPQ$oHikR9LxszOs/o5Z/tBLd2Xr8djSyAWbbffs804cgqA",
                role: "admin"
            };
            await this.userRepository.store(adminUser);
        }
    }
}