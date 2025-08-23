import { computed, Inject, Injectable, Optional, Signal, signal, WritableSignal } from "@angular/core";
import { ITokenService, TOKEN_SERVICE_TOKEN } from "@phobos/core";
import { User } from "../../core/user/models/user.model";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

const AUTH_SERVER_HOSTNAME =  window.location.hostname;
const AUTH_SERVER_PORT = 4000;

const REST_PROTOCOL = window.location.protocol === 'https:' ? 'https' : 'http';
const REST_URL = `${REST_PROTOCOL}://${AUTH_SERVER_HOSTNAME}:${AUTH_SERVER_PORT}`;

@Injectable({
  providedIn: 'root'
})
export class UserRestAdapter {

 private headers: Signal<any> = computed(() => {
   return { 'Authorization': `Bearer ` };
 });

 constructor(
  private readonly http: HttpClient,
  @Optional() @Inject(TOKEN_SERVICE_TOKEN) private tokenService: ITokenService
 ) {}

 public async getUsers() {
    const headers = { 'Authorization': `Bearer ${this.tokenService?.accessToken()}` };

    const users = await firstValueFrom(this.http.get<User[]>(`${REST_URL}/user`, { headers }));
    return users;
 }

 public async setUser(user: User) {
    const headers = { 'Authorization': `Bearer ${this.tokenService?.accessToken()}` };

    await firstValueFrom(this.http.post(`${REST_URL}/user`, user, { headers }));
 }
}