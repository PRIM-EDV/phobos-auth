import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { PhButton, PhButtonList, PhDropdown, PhDropdownItem, PhForm, PhWindow } from "@phobos/elements";

import { Dialog } from "../../../infrastructure/ui/dialog/dialog.interface";
import { User } from "../../../core/user/models/user.model";
import { PhElementsModule } from "../../../../../../libs/phobos-elements/ph-elements.module";


@Component({
  selector: "token-new-dialog",
  standalone: true,
  templateUrl: "./new-token.dialog.component.html",
  styleUrls: ["./new-token.dialog.component.scss"],
  imports: [PhButton, PhButtonList, PhForm, PhWindow, PhDropdown, PhDropdownItem, PhElementsModule],
})
export class NewTokenDialogComponent implements Dialog, OnInit {
  @ViewChild(PhWindow) window!: PhWindow;

  public data?: any;

  public user: User = {
    username: '',
    role: 'admin'
  }

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
    this.close(this.user);
  }

  public cancel() {
    this.close();
  }
}
