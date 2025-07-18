import { Routes } from '@angular/router';
import { LeaveListComponent } from './leave-list.component';
import { LeaveFormComponent } from './leave-form.component';

export const routes: Routes = [
  { path: '', component: LeaveListComponent },
  { path: 'new', component: LeaveFormComponent },
  { path: ':id/edit', component: LeaveFormComponent }
];
