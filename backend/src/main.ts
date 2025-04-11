import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import Redis from 'ioredis';

import * as connectRedis from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up Redis session store
  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.use(cookieParser());
  app.use(session({
    cookie: { 
      maxAge: 3 * 60 * 1000, // 3 minutes
      secure: true, 
      httpOnly: true, 
      sameSite: 'strict' 
    },
    resave: false,
    secret: 'your-secret-key',
    saveUninitialized: false,
    store: new RedisStore({
      client: redisClient
    }),
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
