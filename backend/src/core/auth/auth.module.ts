import { Module } from '@nestjs/common';
import { AuthController } from '../../api/auth.controller';
import { AuthService } from './auth.service';
import { UserController } from '../../api/user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
