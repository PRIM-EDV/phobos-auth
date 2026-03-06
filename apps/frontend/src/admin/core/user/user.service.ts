import { Injectable, signal, WritableSignal } from "@angular/core";

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

  public async deleteUser(username: string) {
    await this.rest.deleteUser(username);
    this.users.update(users => {
      return [...users.filter(u => u.username !== username)];
    });
  }

  public async setUser(user: User) {
    await this.rest.setUser(user);
    this.users.update(users => {
      const existing = users.find(u => u.username === user.username);

      if (existing) {
        user.role = existing.role;
      } else {
        users.push({
          username: user.username,
          role: user.role
        });
      }
      return [...users];
    });
  }
}