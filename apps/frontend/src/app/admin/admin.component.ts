import { Component } from '@angular/core';
import { PhButton, PhButtonList, PhTable, PhWindow } from '@phobos/elements';

import { UserService } from './core/user/user.service';
import { User } from './core/user/models/user.model';
import { DialogService } from './infrastructure/ui/dialog/dialog.service';
import { EditUserDialogComponent } from './presentation/dialogs/edit-user/edit-user.dialog.component';
import { DialogComponent } from "./infrastructure/ui/dialog/dialog.component";

@Component({
  selector: 'app-admin',
  imports: [
    PhButtonList,
    PhWindow,
    PhTable,
    PhButton,
    DialogComponent
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor(
    public readonly user: UserService,
    private dialog: DialogService
  ) {}

  public deleteUser(user: User): void {
    // this.user.deleteUser(user.id).subscribe(() => {
    //   this.user.loadUsers();
    // });
  }

  public async editUser(user: User): Promise<void> {
    const editedUser = await this.dialog.open(EditUserDialogComponent, { user: { ...user } });
    this.user.setUser(editedUser);
  }
}
