import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, data: {
        roles: ['tec', 'sl', 'admin'],
        app: 'ADMIN',
        tab: 'USER'
      } 
    },
    { path: '', redirectTo: '/login', pathMatch: 'full'},
];


//  "name": "ADMIN",
//     "path": "auth",
//     "roles": ["tec", "sl", "admin"],
//     "tabs": [
//         {
//             "tabName": "USER",
//             "tabPath": "user"
//         }
//     ]