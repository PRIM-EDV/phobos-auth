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

const { values } = parseArgs({
  options: {
    configuration: { type: 'string' },
  },
});

const MONGO_DB_HOST = process.env.MONGO_DB_HOST ? process.env.MONGO_DB_HOST : 'localhost'
const ENV_FILE = values.configuration == "development" ? 'environment.development.ts' : 'environment.ts';

@Module({
  imports: [
    AuthModule,
    OAuth2Module,
    MongooseModule.forRoot(`mongodb://${MONGO_DB_HOST}/nest`),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/auth/'],
    }),
    WinstonLoggerModule,
    ConfigModule.forRoot({
      envFilePath: `src/environments/${ENV_FILE}`,
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
