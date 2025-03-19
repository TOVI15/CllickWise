import { Routes } from '@angular/router';
import { LoginComponent } from '../component/login/login.component';
import { AuthComponent } from '../component/auth/auth.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, 
    { path: 'auth', component: AuthComponent }
];
