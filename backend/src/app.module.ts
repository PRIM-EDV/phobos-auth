import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './core/auth/auth.module';

// Controllers
import { AuthController } from './api/auth.controller';
import { UserController } from './api/user.controller';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController
  ],
  providers: [AppService],
})
export class AppModule {}
