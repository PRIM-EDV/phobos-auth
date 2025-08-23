import { Component } from '@angular/core';
import { PhButton, PhCommandList, PhTable, PhWindow } from '@phobos/elements';

import { HashService } from '../common/hash.service';
import { UserService } from './core/user/user.service';
import { User } from './core/user/models/user.model';
import { DialogService } from './infrastructure/ui/dialog/dialog.service';
import { EditUserDialogComponent } from './presentation/dialogs/edit-user/edit-user.dialog.component';
import { DialogComponent } from "./infrastructure/ui/dialog/dialog.component";
import { NewUserDialogComponent } from './presentation/dialogs/new-user/new-user.dialog.component';
import { NewTokenDialogComponent } from './presentation/dialogs/new-token/new-token.dialog.component';
import { UserRestAdapter } from './infrastructure/rest/user.rest.adapter';

@Component({
  selector: 'app-admin',
  imports: [
    PhCommandList,
    PhWindow,
    PhTable,
    PhButton,
    DialogComponent
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  private link = document.createElement('a');

  constructor(
    public readonly user: UserService,
    private dialog: DialogService,
    private rest: UserRestAdapter,
    private hash: HashService
  ) {}

  public async deleteUser(user: User): Promise<void> {
    await this.user.deleteUser(user.username);
  }

  public async editUser(user: User): Promise<void> {
    const editedUser = await this.dialog.open(EditUserDialogComponent, { user: { ...user } });
    if (editedUser) {
      if (editedUser.password) {
        editedUser.password = this.hash.sha256(editedUser.password);
      }
      this.user.setUser(editedUser);
    }
  }

  public async newToken(): Promise<void> {
    const newToken = await this.dialog.open(NewTokenDialogComponent);
    if (newToken) {
      const token = await this.rest.getUserToken(newToken);
      this.downloadToken(token, `${newToken.username}-token.json`);
    }
  }

  public async newUser(): Promise<void> {
    const newUser = await this.dialog.open(NewUserDialogComponent);
    if (newUser) {
      if (newUser.password) {
        newUser.password = await this.hash.sha256(newUser.password);
      }
      this.user.setUser(newUser);
    }
  }

  private downloadToken(token: string, filename: string) {
    const blob = new Blob([JSON.stringify(token)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    this.link.href = url;
    this.link.download = filename;
    this.link.click();

    URL.revokeObjectURL(url);
  }
}