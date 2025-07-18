import { Routes } from '@angular/router';
import { LeaveListComponent } from './leave-list.component';
import { LeaveFormComponent } from './leave-form.component';
import { authGuard } from '@core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: LeaveListComponent
  },
  {
    path: 'new',
    canActivate: [authGuard],
    component: LeaveFormComponent
  },
  {
    path: ':id/edit',
    canActivate: [authGuard],
    component: LeaveFormComponent
  }
];
