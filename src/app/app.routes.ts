import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component.js';
import { DashboardComponent } from './pages/dashboard/dashboard.component.js';
import { AuthGuard } from './guards/auth.guards.js';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
