import { Inject, Injectable } from '@nestjs/common';

import * as argon2 from "argon2";

import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { User } from './models/user';

@Injectable()
export class AuthService {

    constructor(
        @Inject("UserRepository") private userRepository: UserRepository
    ) {}

    public async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userRepository.get(username);

        if (user && await argon2.verify(user.password, password)) {
            return user;
        } else {
            throw new Error('Invalid credentials');
        }
    }
}