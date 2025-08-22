import { Component } from '@angular/core';
import { PhButton, PhTable, PhWindow } from '@phobos/elements';

import { UserService } from './core/user/user.service';
import { User } from './core/user/models/user.model';

@Component({
  selector: 'app-admin',
  imports: [
    PhWindow,
    PhTable,
    PhButton
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor(public readonly user: UserService) {}

  public deleteUser(user: User): void {
    // this.user.deleteUser(user.id).subscribe(() => {
    //   this.user.loadUsers();
    // });
  }

  public editUser(user: User): void {
    // this.user.editUser(user).subscribe(() => {
    //   this.user.loadUsers();
    // });
  }
}
