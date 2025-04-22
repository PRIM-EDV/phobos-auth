import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';

// Controllers
import { AuthController } from './api/auth.controller';
import { UserController } from './api/user.controller';
import { WinstonLoggerModule } from './infrastructure/logger/winston/winston.logger.module';

const MONGO_DB_HOST = process.env.MONGO_DB_HOST ? process.env.MONGO_DB_HOST : 'localhost'

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(`mongodb://${MONGO_DB_HOST}/nest`),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/auth/'],
    }),
    WinstonLoggerModule
  ],
  controllers: [
    AppController,
    AuthController,
    UserController
  ],
  providers: [AppService],
})
export class AppModule {}
