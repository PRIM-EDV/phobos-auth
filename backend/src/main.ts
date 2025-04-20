import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { randomBytes } from 'node:crypto';

import Redis from 'ioredis';
import RedisStore from 'connect-redis';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

const REDIS_DB_HOST = process.env.REDIS_DB_HOST ? process.env.REDIS_DB_HOST : 'localhost:6379'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisClient = new Redis(`${REDIS_DB_HOST}`);

  app.use(cookieParser());
  app.use(session({
    cookie: { 
      maxAge: 3 * 60 * 1000, // 3 minutes 
    },
    resave: false,
    secret: randomBytes(32).toString('hex'),
    saveUninitialized: false,
    store: new RedisStore({
      client: redisClient
    }),
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
