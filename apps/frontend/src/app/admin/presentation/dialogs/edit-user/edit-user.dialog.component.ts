import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { PhButton, PhButtonList, PhDropdown, PhDropdownItem, PhForm, PhInput, PhWindow } from "@phobos/elements";

import { User } from "../../../core/user/models/user.model";
import { Dialog } from "../../../infrastructure/ui/dialog/dialog.interface";


@Component({
  selector: "user-edit-dialog",
  standalone: true,
  templateUrl: "./edit-user.dialog.component.html",
  styleUrls: ["./edit-user.dialog.component.scss"],
  imports: [PhButton, PhButtonList, PhForm, PhWindow, PhDropdown, PhDropdownItem, PhInput],
})
export class EditUserDialogComponent implements Dialog, OnInit, AfterViewInit {
  @ViewChild(PhWindow) window!: PhWindow;

  public data!: { user: User };
  public user!: User;

  public password = '';
  public passwordRepeated = '';

  constructor() {}

  ngOnInit(): void {
    this.user = this.data.user;
  }

  ngAfterViewInit(): void {
    // if (this.data.position) {
    //   this.window.ref.nativeElement.style.top = `${this.data.position.y}px`;
    //   this.window.ref.nativeElement.style.left = `${this.data.position.x}px`;
    // }
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
