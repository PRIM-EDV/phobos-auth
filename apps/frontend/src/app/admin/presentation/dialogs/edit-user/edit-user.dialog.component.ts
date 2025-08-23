import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { PhButton, PhButtonList, PhDropdown, PhDropdownItem, PhForm, PhWindow } from "@phobos/elements";

import { Dialog } from "../../../infrastructure/ui/dialog/dialog.interface";
import { User } from "../../../core/user/models/user.model";


@Component({
  selector: "user-edit-dialog",
  standalone: true,
  templateUrl: "./edit-user.dialog.component.html",
  styleUrls: ["./edit-user.dialog.component.scss"],
  imports: [PhButton, PhButtonList, PhForm, PhWindow, PhDropdown, PhDropdownItem],
})
export class EditUserDialogComponent implements Dialog, OnInit, AfterViewInit {
  @ViewChild(PhWindow) window!: PhWindow;

  public data!: { user: User };


  constructor() {}

  ngOnInit(): void {
    // this.squad = this.data.squad;
  }

  ngAfterViewInit(): void {
    // if (this.data.position) {
    //   this.window.ref.nativeElement.style.top = `${this.data.position.y}px`;
    //   this.window.ref.nativeElement.style.left = `${this.data.position.x}px`;
    // }
  }

  close(result: any = null) {
    if (result) {
      return this.data.user;
    } else {
      return null;
    }
  }

  public submit() {
    this.close(this.data.user);
  }

  public cancel() {
    this.close();
  }
}
