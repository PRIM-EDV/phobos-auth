import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';


import { HashService } from '../common/hash.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public readonly error: WritableSignal<string | null> = signal<string | null>(null);
  
  constructor(
    private readonly hash: HashService,
    private readonly http: HttpClient
  ) { }

  /**
   * Login with the given username and password.
   * 
   * @param {string} username - The username of the user 
   * @param {string} password - The password of the user
   */
  public async login(username: string, password: string): Promise<void> {
    const credentials = { username: username, password: await this.hash.sha256(password) };

    try {
      const res: HttpResponse<{ redirectTo: string }> = await firstValueFrom(
        this.http.post<{ redirectTo: string }>(`${window.location.origin}/auth/v1/login`, credentials, { observe: 'response' })
      );

      if (res.status === 200 && res.body?.redirectTo) {
        window.location.href = res.body?.redirectTo;
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 401) {
        this.error.set('Invalid username or password.');
      } else if (error.status === 403) {
        this.error.set('Your login session has expired.');
      }
    }
  }

  /**
   * Check if the user has a valid server-side session.
   * 
   * @returns {Promise<boolean>} - True if the user has a valid session, false otherwise
   */
  public async hasValidSession(): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ session: boolean }>(`${window.location.origin}/auth/v1/session`, { observe: 'response' })
      );
      return res.status === 200 && res.body?.session || false;
    } catch (error: any) {
      return false;
    }
  }
}
