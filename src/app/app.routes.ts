import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'leave', pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'leave',
        loadChildren: () => import('./features/leave/leave.routes').then(m => m.routes),
      },
      {
        path: 'approvals',
        loadChildren: () => import('./features/approvals/approvals.routes').then(m => m.routes),
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  }
];
