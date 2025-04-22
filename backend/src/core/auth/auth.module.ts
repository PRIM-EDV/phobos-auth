import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { UserRepositoryModule } from 'src/infrastructure/repositories/user.repository.module';

@Module({
  imports: [ UserRepositoryModule ],
  controllers: [],
  providers: [ AuthService, UserService ],
  exports: [ AuthService, UserService ]
})
export class AuthModule {}
