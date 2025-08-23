import { Injectable, signal, WritableSignal } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { User } from "./models/user.model";
import { UserRestAdapter } from "../../infrastructure/rest/user.rest.adapter";


@Injectable({
    providedIn: 'root'
})
export class UserService {
    public users: WritableSignal<User[]> = signal([]);

  constructor(
    private readonly rest: UserRestAdapter
  ) {
    this.rest.getUsers().then(users => this.users.set(users));
  }

  public async setUser(user: User) {
    await this.rest.setUser(user);
  }
}