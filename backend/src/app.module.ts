import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';

// Controllers
import { AuthController } from './api/auth.controller';
import { UserController } from './api/user.controller';

const MONGO_DB_HOST = process.env.MONGO_DB_HOST ? process.env.MONGO_DB_HOST : 'localhost'

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(`mongodb://${MONGO_DB_HOST}/nest`),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController
  ],
  providers: [AppService],
})
export class AppModule {}
