import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { OAuth2Service } from './oauth2.service';
import { USerRepositoryModule } from 'src/infrastructure/repositories/user.repository.module';

@Module({
  imports: [ USerRepositoryModule ],
  controllers: [],
  providers: [ AuthService, OAuth2Service, UserService ],
  exports: [ AuthService, OAuth2Service, UserService ]
})
export class AuthModule {}
