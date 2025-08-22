import { effect, Injectable, signal, WritableSignal } from "@angular/core";
import { HttpClient, httpResource } from '@angular/common/http';

import { User } from "./models/user.model";

// const AUTH_SERVER_HOSTNAME = window?.__env?.AUTH_SERVER_HOSTNAME || window.location.hostname;
// const AUTH_SERVER_PORT = window?.__env?.AUTH_SERVER_PORT || 3006;
const AUTH_SERVER_HOSTNAME =  window.location.hostname;
const AUTH_SERVER_PORT = 4000;

const REST_PROTOCOL = window.location.protocol === 'https:' ? 'https' : 'http';
const REST_URL = `${REST_PROTOCOL}://${AUTH_SERVER_HOSTNAME}:${AUTH_SERVER_PORT}`;

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public users: WritableSignal<User[]> = signal([]);

  constructor(private readonly http: HttpClient) {
    this.http.get<User[]>(`${REST_URL}/user`).subscribe(users => {
      this.users.set(users);
    });
  }
}