import { Component } from '@angular/core';

import { PhElementsModule } from '../../../lib/phobos-elements/ph-elements.module';

@Component({
  selector: 'app-login',
  imports: [
    PhElementsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public username: string = '';
  public password: string = '';

  public login() {
    console.log('login');
  }
}
