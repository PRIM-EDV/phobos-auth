import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly http: HttpClient) { }

  public async login(username: string, password: string): Promise<void> {
    const credentials = { username: username, password: await this.sha256(password) };

    const res = await this.http.post('/auth/login', credentials, { withCredentials: true }).toPromise();
  }

  private sha256(str: string): Promise<string> {
    const hash = crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));

    return hash.then(buffer => {
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
      return hashHex;
    });
  }
  
}
