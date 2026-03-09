import { Inject, Injectable, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IRegistryService, ITokenService, MFE_REGISTRY_SERVICE_TOKEN, TOKEN_SERVICE_TOKEN } from "@phobos/core";

import { User } from "../../core/user/models/user.model";
import { firstValueFrom } from "rxjs";

const AUTH_SERVER_HOSTNAME = window.__env?.AUTH_SERVER_HOSTNAME ? window.__env?.AUTH_SERVER_HOSTNAME : window.location.hostname;
const AUTH_SERVER_PORT = window.__env?.AUTH_SERVER_PORT ? window.__env?.AUTH_SERVER_PORT : 3000;

const REST_PROTOCOL = window.location.protocol === 'https:' ? 'https' : 'http';
const REST_URL = `${REST_PROTOCOL}://${AUTH_SERVER_HOSTNAME}:${AUTH_SERVER_PORT}`;

@Injectable({
  providedIn: 'root'
})
export class UserRestAdapter {
  private apiUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Optional() @Inject(TOKEN_SERVICE_TOKEN) private tokenService: ITokenService,
    @Optional() @Inject(MFE_REGISTRY_SERVICE_TOKEN) private registry: IRegistryService
  ) {
    this.apiUrl = this.initializeApiUrl();
  }

  public async deleteUser(username: string) {
    const headers = { 'Authorization': `Bearer ${this.tokenService?.accessToken()}` };

    await firstValueFrom(this.http.delete(`${this.apiUrl}/v1/user`, { headers, body: { username } }));
  }

  public async getUsers() {
    const headers = { 'Authorization': `Bearer ${this.tokenService?.accessToken()}` };
    console.log(headers)
    const users = await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/v1/user`, { headers }));
    return users;
  }

  public async getUserToken(user: User) {
    const headers = { 'Authorization': `Bearer ${this.tokenService?.accessToken()}` };

    const token = await firstValueFrom(this.http.post<string>(`${this.apiUrl}/v1/user/token`, user, { headers }));
    return token;
  }

  public async setUser(user: User) {
    const headers = { 'Authorization': `Bearer ${this.tokenService?.accessToken()}` };

    await firstValueFrom(this.http.post(`${this.apiUrl}/v1/user`, user, { headers }));
  }

  private initializeApiUrl(): string {
    const authProvider = this.registry?.find({ name: 'phobos-auth' });

    if (authProvider) {
      return authProvider[0].apiUrl.toString();
    }
    return REST_URL;
  }
}