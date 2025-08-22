import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare global {
  interface Window {
    __env?: {
      AUTH_SERVER_HOSTNAME?: string;
      AUTH_SERVER_PORT?: number;
    };
  }
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'phobos-auth';
}
