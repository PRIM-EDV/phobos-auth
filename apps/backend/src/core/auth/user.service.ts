import { Inject, Injectable } from '@nestjs/common';

import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { User } from './models/user';

@Injectable()
export class UserService {
    constructor(
        @Inject("UserRepository") private userRepository: UserRepository
    ) {}

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
}