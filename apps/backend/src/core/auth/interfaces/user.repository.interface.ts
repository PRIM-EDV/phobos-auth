import { User } from "../models/user";

export interface IUserRepository {
    delete(username: string): Promise<void>;
    store(user: User): Promise<void>;

    get(): Promise<User[]>;
    get(name: string): Promise<User>;

    exists(user: User): Promise<boolean>;
}