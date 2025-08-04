import { Injectable } from "@nestjs/common";
import { ICache } from "src/core/common/interfaces/cache.interface";

import Redis from 'ioredis';

const REDIS_DB_HOST = process.env.REDIS_DB_HOST ? process.env.REDIS_DB_HOST : 'localhost:6379'

@Injectable()
export class RedisCache implements ICache {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis(REDIS_DB_HOST);
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    public async set<T>(key: string, value: T, ttl = 300): Promise<void> {
        await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    }

    public async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        const value = await this.client.exists(key);
        return value === 1;
    }
}