import { Module } from '@nestjs/common';
import { OAuth2ApiController } from './api/oauth2.api.controller';
import { OAuth2Service } from './oauth2.service';

@Module({
  imports: [],
  controllers: [OAuth2ApiController],
  providers: [OAuth2Service],
})
export class Oauth2Module {}
