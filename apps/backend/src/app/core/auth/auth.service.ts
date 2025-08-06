import { Inject, Injectable } from '@nestjs/common';

import * as argon2 from "argon2";

import { User } from './models/user';
import { IUserRepository } from './interfaces/user.repository.interface';
import { UnauthorizedError } from 'src/app/common/error/unauthorized.error';

@Injectable()
export class AuthService {

    constructor(
        @Inject("UserRepository") private userRepository: IUserRepository
    ) {}

    public async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userRepository.get(username);

        if (user && await argon2.verify(user.password, password)) {
            return user;
        } else {
            throw new UnauthorizedError('Invalid credentials');
        }
    }
}