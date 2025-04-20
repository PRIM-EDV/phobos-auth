import { Component } from '@angular/core';

import { PhElementsModule } from '../../../lib/phobos-elements/ph-elements.module';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  imports: [
    PhElementsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public username: string = '';
  public password: string = '';

  public constructor(private readonly loginService: LoginService) { }

  public async login(): Promise<void> {
    return this.loginService.login(this.username, this.password);
  }
}
