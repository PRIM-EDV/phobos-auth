import { User } from "../models/user";

export interface IUserRepository {
    delete(entity: User): Promise<void>;
    store(entity: User): Promise<void>;

    get(): Promise<User[]>;
    get(name: string): Promise<User>;

    exists(entity: User): Promise<boolean>;
}