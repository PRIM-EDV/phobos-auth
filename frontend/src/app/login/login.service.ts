import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly http: HttpClient) { }

  /**
   * Login with the given username and password.
   * 
   * @param {string} username - The username of the user 
   * @param {string} password - The password of the user
   */
  public async login(username: string, password: string): Promise<void> {
    const credentials = { username: username, password: await this.sha256(password) };

    const res: HttpResponse<{ redirectTo: string }> = await firstValueFrom(
      this.http.post<{ redirectTo: string }>('/auth/login', credentials, { observe: 'response' })
    );

    if (res.status === 200 && res.body?.redirectTo) {
      window.location.href = res.body?.redirectTo;
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
