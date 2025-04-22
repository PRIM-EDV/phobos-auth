import { Module } from '@nestjs/common';
import { RedisCache } from './redis.cache';

@Module({
    imports: [],
    providers: [{
        provide: "Cache",
        useClass: RedisCache
    }],
    exports: [{
        provide: "Cache",
        useClass: RedisCache
    }]
})
export class RedisCacheModule { }