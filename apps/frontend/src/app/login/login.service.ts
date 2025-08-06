import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

// import { environment } from '../../environments/environment';

const AUTH_SERVER_HOSTNAME = window.location.hostname;
const AUTH_SERVER_PORT = 4000;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public readonly error: WritableSignal<string | null> = signal<string | null>(null);
  
  constructor(private readonly http: HttpClient) { }

  /**
   * Login with the given username and password.
   * 
   * @param {string} username - The username of the user 
   * @param {string} password - The password of the user
   */
  public async login(username: string, password: string): Promise<void> {
    const credentials = { username: username, password: await this.sha256(password) };

    try {
      const res: HttpResponse<{ redirectTo: string }> = await firstValueFrom(
        this.http.post<{ redirectTo: string }>(`http://${AUTH_SERVER_HOSTNAME}:${AUTH_SERVER_PORT}/auth/login`, credentials, { observe: 'response' })
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
      console.log(`Checking session at http://${AUTH_SERVER_HOSTNAME}:${AUTH_SERVER_PORT}/auth/session`);
      const res = await firstValueFrom(
        this.http.get<{ session: boolean }>(`http://${AUTH_SERVER_HOSTNAME}:${AUTH_SERVER_PORT}/auth/session`, { observe: 'response' })
      );
      console.log(res);
      return res.status === 200 && res.body?.session || false;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Hash the given string using SHA-256.
   * 
   * @param {string} str - The string to hash
   * @returns {Promise<string>} - The hashed string
   */
  private async sha256(str: string): Promise<string> {
    const hash = crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));

    return hash.then(buffer => {
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
      return hashHex;
    });
  }
  
}
