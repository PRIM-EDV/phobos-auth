import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { AuthController } from './api/auth.controller';
import { UserController } from './api/user.controller';
import { WinstonLoggerModule } from './infrastructure/logger/winston/winston.logger.module';
import { OAuth2Module } from './core/oauth2/oauth2.module';

import environment  from 'src/environments/environment';
import environmentDevelopment from 'src/environments/environment.development';

const { values } = parseArgs({
  options: {
    configuration: { type: 'string' },
  },
});

const MONGO_DB_HOST = process.env.MONGO_DB_HOST ? process.env.MONGO_DB_HOST : 'localhost'

@Module({
  imports: [
    AuthModule,
    OAuth2Module,
    MongooseModule.forRoot(`mongodb://${MONGO_DB_HOST}/auth`),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api'],
    }),
    WinstonLoggerModule,
    ConfigModule.forRoot({
      load: [ values.configuration == "development" ? environmentDevelopment : environment ],
      isGlobal: true,
    })
  ],
  controllers: [
    AppController,
    AuthController,
    UserController
  ],
  providers: [AppService],
})
export class AppModule {}
