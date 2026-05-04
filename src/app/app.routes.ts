import { Routes } from '@angular/router';

import { defaultMicroFrontendGuard } from './guards/default-micro-frontend.guard';
import { authGuard } from './guards/auth.guard';
import { microFrontendMatchGuard } from './guards/micro-frontend-match.guard';
import { microFrontendConfigResolver } from './resolvers/micro-frontend-config.resolver';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((component) => component.LoginComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [defaultMicroFrontendGuard],
    loadComponent: () =>
      import('./layouts/dashboard/dashboard.component').then(
        (component) => component.DashboardComponent
      ),
  },
  {
    path: ':microFrontendPath',
    canMatch: [microFrontendMatchGuard],
    canActivate: [authGuard],
    resolve: {
      mfConfig: microFrontendConfigResolver,
    },
    loadComponent: () =>
      import('./layouts/dashboard/dashboard.component').then(
        (component) => component.DashboardComponent
      ),
  },
  {
    path: '**',
    canActivate: [defaultMicroFrontendGuard],
    loadComponent: () =>
      import('./layouts/dashboard/dashboard.component').then(
        (component) => component.DashboardComponent
      ),
  },
];
