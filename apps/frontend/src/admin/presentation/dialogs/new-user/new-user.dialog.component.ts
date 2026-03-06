import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { PhButton, PhButtonList, PhDropdown, PhDropdownItem, PhForm, PhInput, PhWindow } from "@phobos/elements";

import { Dialog } from "../../../infrastructure/ui/dialog/dialog.interface";
import { User } from "../../../core/user/models/user.model";


@Component({
  selector: "user-new-dialog",
  standalone: true,
  templateUrl: "./new-user.dialog.component.html",
  styleUrls: ["./new-user.dialog.component.scss"],
  imports: [PhButton, PhButtonList, PhForm, PhWindow, PhDropdown, PhDropdownItem, PhInput],
})
export class NewUserDialogComponent implements Dialog, OnInit {
  @ViewChild(PhWindow) window!: PhWindow;

  public data?: any;
  public user: User = {
    username: '',
    role: 'admin'
  }

  public password = '';
  public passwordRepeated = '';

  constructor() {}

  ngOnInit(): void {

  }

  close(result: any = null) {
    if (result) {
      return this.user;
    } else {
      return null;
    }
  }

  public submit() {
    if (this.password && this.password === this.passwordRepeated) {
      this.user.password = this.password;
    }
    
    this.close(this.user);
  }

  public cancel() {
    this.close();
  }
}
