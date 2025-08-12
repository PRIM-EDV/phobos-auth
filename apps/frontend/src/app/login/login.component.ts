import { AfterViewInit, Component } from '@angular/core';
import { PhButton, PhButtonList, PhForm, PhInput, PhWindow } from '@phobos/elements';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  imports: [
    PhWindow,
    PhForm,
    PhInput,
    PhButtonList,
    PhButton,
    PhError
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit{

  public hasValidSession: boolean = true;
  public username: string = '';
  public password: string = '';

  public constructor(
    public readonly loginService: LoginService,
  ) {}

  public async ngAfterViewInit(): Promise<void> {
    this.hasValidSession = await this.loginService.hasValidSession();
  }

  public async login(): Promise<void> {
    return this.loginService.login(this.username, this.password);
  }

}
