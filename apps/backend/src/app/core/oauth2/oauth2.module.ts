import { Module } from '@nestjs/common';
import { OAuth2Service } from './oauth2.service';
import { RedisCacheModule } from 'src/app/infrastructure/cache/redis.cache.module';

@Module({
  imports: [ RedisCacheModule ],
  controllers: [],
  providers: [ OAuth2Service ],
  exports: [ OAuth2Service ]
})
export class OAuth2Module {}
