import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenApiController } from './api/token.api.controller';

@Module({
  imports: [],
  controllers: [AppController, TokenApiController],
  providers: [AppService],
})
export class AppModule {}
